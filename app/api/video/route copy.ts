import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
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

    const freeTrial = await checkApiLimit()

    if(!freeTrial){
      return new NextResponse("Free trial has expired!", {status: 403})
    
    }

    
    const output = await replicate.run(
      "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
      {
        input: {
          prompt: prompt
        }
      }
    );

    // console.log("Fake return")
    const forceResponse = {
      audio: 'https://replicate.delivery/pbxt/HQrgPD9EXdrKJlVg3ro3ixeN1CxNetMhFBpZ7hRMOgv7HPrRA/gen_sound.wav',
      spectrogram: 'https://replicate.delivery/pbxt/TfU5bhA5rZ0uU6aKepwSOZj54AQWoWDELRZQ0bTHeXp4PesGB/spectrogram.jpg'
    }

    console.log("FAKE RESPONSE")
    console.log(output)

    await increaseApiLimit();
    return NextResponse.json(output);
  }
  
  catch (error) {
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
