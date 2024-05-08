import { auth } from "@clerk/nextjs";
import { error } from "console";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { increaseApiLimit, checkApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const NO_FOUNDS_API_MESSAGE: String =
"GENIUS is currently not working. Please contact support and try again later.";

export async function POST(req: Request) {
  try {
    // Authentication using CLERK
    const { userId } = auth();
    // Set the body of the request
    const body = await req.json();
    // Retrieve the message from the request
    const { messages } = body;

    // Validations
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!openai.apiKey) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }
    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired!", { status: 403 });
    }

    // Get ChatGPT 3.5 response from openai library
    const response = await openai.chat.completions
      .create({
        model: "gpt-3.5-turbo",
        messages,
      })
      .catch(function (error) {
        // Error handling
        const errorMessage: String =
          NO_FOUNDS_API_MESSAGE +
          ' The error message from the API request is the following: "' +
          error.error.message +
          '"';

        // Return the error simulating a chatbot response using an object to respect types
        return stringAsChatCompletion(errorMessage);
      });
    //Send the message

    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(response.choices.data.message);
  } catch (error) {
    // Error handling.
    console.log("[CONVERSATION _ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

function stringAsChatCompletion(string: String) {
  // Returns an error as if it was a OpenAI.Chat.Completions.ChatCompletion type response.
  return {
    choices: {
      data: {
        message: {
          content: string,
        },
      },
    },
  };
}
