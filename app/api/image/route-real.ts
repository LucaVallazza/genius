import { auth } from "@clerk/nextjs";
import { error } from "console";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import axios from "axios";
import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const NO_FOUNDS_API_MESSAGE: String =
  "The API call was rejected because the API KEY has no more free calls. That's probably because Luca was testing new projects and reached the limit of calls.";

export async function POST(req: Request) {
  try {
    // Authentication using CLERK
    const { userId } = auth();
    // Set the body of the request
    const body = await req.json();
    // Retrieve the message from the request
    const { prompt, negative_prompt, samples = 1, resolution = "512" } = body;

    // Validations
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!process.env.STABLEDIFFUSION_API_KEY) {
      return new NextResponse("Stable diffusion api key not configured", { status: 503 });
    }
    if (!prompt) {
      return new NextResponse("Prompt is required", { status: 400 });
    }

    if (!samples) {
      return new NextResponse("Sample (Sample size) is required", { status: 400 });
    }

    if (!resolution) {
      return new NextResponse("Resolution is required", { status: 400 });
    }
    // Get ChatGPT 3.5 response from openai library


    const freeTrial = await checkApiLimit()

    if(!freeTrial){
      return new NextResponse("Free trial has expired!", {status: 403})
    }

    const messageBody = {
      "key": process.env.STABLEDIFFUSION_API_KEY,
      "prompt": prompt,
      "negative_prompt": negative_prompt,
      "width": resolution,
      "height": resolution,
      "samples": samples,
      "num_inference_steps": "20",
      "safety_checker": "no",
      "enhance_prompt": "yes",
      "seed": null,
      "guidance_scale": 7.5,
      "multi_lingual": "no",
      "panorama": "no",
      "self_attention": "no",
      "upscale": "no",
      "embeddings_model": null,
      "webhook": null,
      "track_id": null
    };

    const response = await axios.post("https://stablediffusionapi.com/api/v3/text2img", messageBody )
      .catch(function (error) {
        // Error handling

        console.log("ERROR STABLE DIFFUSION");
        console.log(error);

        return (error);
      });
    
     //Send the message
    console.log(response.data.output)

    // Increment the number of uses.
    await increaseApiLimit();
    return NextResponse.json({output: response.data.output});
  } catch (error) {
    // Error handling.
    console.log("[IMAGE_GENERATION _ERROR]", error);
    return new NextResponse("[IMAGE_GENERATION _ERROR] Internal Error", { status: 500 });
  }
}
