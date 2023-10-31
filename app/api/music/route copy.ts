import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs";
import { error } from "console";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!
})



const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});


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

    const freeTrial = await checkApiLimit()

    if(!freeTrial){
      return new NextResponse("Free trial has expired!", {status: 403})
    
    }


    const output = await replicate.run(
      "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
      {
        input: {
          prompt_a: prompt
        }
      }
    );

    // Get ChatGPT 3.5 response from openai library
    
    // await openai.chat.completions
    //   .create({
    //     model: "gpt-3.5-turbo",
    //     messages,
    //   })
    //   .catch(function (error) {
    //     // Error handling
    //     const errorMessage: String =
    //       NO_FOUNDS_API_MESSAGE +
    //       " The error message from the API request is the following: \"" +
    //       error.error.message + "\"";

    //     // Return the error simulating a chatbot response using an object to respect types
    //     return stringAsChatCompletion(errorMessage);
    //   });
    //Send the message
    console.log(output)

    await increaseApiLimit();
    
    return NextResponse.json(output);
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
