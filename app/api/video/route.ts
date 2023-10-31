import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs"; 
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!
})


const NO_FOUNDS_API_MESSAGE: String =
  "The API call was rejected because the API KEY has no more free calls. That's probably because Luca was testing new projects and reached the limit of calls.";

export async function POST(req: Request) {
  try {
    // Authentication using CLERK
    const { userId } = auth();
    // Set the body of the request
    const body = await req.json();
    // Retrieve the message from the request
    const { prompt } = body;

    // Validations
    if (!userId) {
      return new NextResponse("Unauthorized by CLERK", { status: 401 });
    }
    if (!process.env.OPENAI_API_KEY) {
      return new NextResponse("OpenAI API Key not configured", { status: 500 });
    }
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    const freeTrial = await checkApiLimit();
    const isPro = await checkSubscription();

    if (!freeTrial && !isPro) {
      return new NextResponse("Free trial has expired!", { status: 403 });
    }

    const forceResponse = [
      'https://pbxt.replicate.delivery/YtJC1byGyNLOEJKmUUUkiLUxZDrOvTzhkrrzkRQ99n6S7zaE/output-0.mp4'
    ]

    console.log("FAKE RESPONSE")

    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(forceResponse);
  } catch (error) {
    // Error handling.
    console.log("[VIDEO_ERROR]", error);
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
