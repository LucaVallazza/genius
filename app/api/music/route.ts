import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { error } from "console";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!
})

const NO_FOUNDS_API_MESSAGE: String =
"GENIUS is currently not working. Please contact support and try again later.";

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
    const isPro = await checkSubscription()
    
    if(!freeTrial && !isPro){
      return new NextResponse("Free trial has expired!", {status: 403})
    
    }
    
    const forceResponse = {
      audio: 'https://replicate.delivery/pbxt/HQrgPD9EXdrKJlVg3ro3ixeN1CxNetMhFBpZ7hRMOgv7HPrRA/gen_sound.wav',
      spectrogram: 'https://replicate.delivery/pbxt/TfU5bhA5rZ0uU6aKepwSOZj54AQWoWDELRZQ0bTHeXp4PesGB/spectrogram.jpg'
    }
    
    if (!isPro) {
      await increaseApiLimit();
    }

    return NextResponse.json(forceResponse);
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
