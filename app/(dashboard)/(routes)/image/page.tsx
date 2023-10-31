"use client";

import axios from "axios";

import * as z from "zod";
import Heading from "@/components/heading";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { DownloadIcon, ImageIcon } from "lucide-react";

import { formSchema, resolutionOptions, samplesOption } from "./constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useState } from "react";

import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { forEachChild } from "typescript";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const ImagePage = () => {
  const router = useRouter();

  // the "images" will be urls, so Images is a string[]
  const [images, setImages] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      negative_prompt: "",
      resolution: "512",
      samples: "1",
    },
  });
  const proModal = useProModal()
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("Submited")
    try {
      setImages([]);


      // We send the message and look for the response
      const response = await axios.post("/api/image", values);

      // TODO: Change this to use stable diffusion.
      // This should be an array of urls

      //TODO: Handle errors
      const urls : string[] = response.data.output.map((url : string[]) => url)

      setImages(urls);

      // form.reset();
    } catch (error) {
      if(error?.response?.status === 403){
        proModal.onOpen()
      }else{
        toast.error("Something went wrong");
      }
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Image generation"
        description="Turn your prompr into an image."
        icon={ImageIcon}
        iconColor="text-pink-700"
        bgColor="bg-pink-700/10"
      />

      <div className="px-4 lg:px-8">
        <div>
          {/* Using {...form} we set every property related to react-hook-form to the FORM component  */}
          <Form {...form}>
            {/* Form with responsive design GRID display  */}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              action=""
              className="rounded-lg border w-full  px-3 md:px-6
            focus-within:shadow-sm grid-cols-12 grid gap-2 p-4"
            >
              {/* Form field to load the prompt */}
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="flex col-span-12 lg:col-span-9">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="p-2"
                        disabled={isLoading}
                        placeholder="A picture of a horse in Swiss alps"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="flex justify-center col-span-12 space-x-2 lg:col-span-3 order-3 lg:order-2">
              <FormField 
              
                control={form.control}
                name="resolution"
                render={({ field }) => (
                  <FormItem className="w-full focus-within:shadow-sm" >
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder={field.value}
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {resolutionOptions.map((resolution) => (
                          <SelectItem
                            key={resolution.value}
                            value={resolution.value}
                          >
                            {resolution.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {/* We must add another form field because the number of samples will be choosen from given options */}
              <FormField
                control={form.control}
                name="samples"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select the amount of photos"
                          />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {samplesOption.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              </div>
              {/* FormField for resolution */}


              {/* Form field for the negative prompts */}
              <FormField
                name="negative_prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-9 order-2 lg:order-3">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="p-2"
                        disabled={isLoading}
                        placeholder="Negative prompts (Optional)"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Responsive design using grid span */}
              <Button
                className="col-span-12 lg:col-span-3 w-full order-4"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>

        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-20">
              <Loader />
            </div>
          )}
          {images.length === 0 && !isLoading && (
            <Empty label="No images generated." />
          )}
          <div className="flex lg:flex-row  flex-col justify-center lg:content-between items-center flex-wrap xl:flex-nowrap space-x-2">
            {images.map((image) => (
                <Card key={image} className="box-border w-80 overflow-hidden rounded-lg">
                  <div className="relative aspect-square w-full">
                    <Image src={image} fill alt="Image"></Image>
                  </div>
                  <CardFooter className="p-2">
                    <Button 
                    onClick={()=> window.open(image)}
                    variant={"secondary"}
                    className="w-full"
                    >
                      <DownloadIcon className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardFooter>
                </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePage;
