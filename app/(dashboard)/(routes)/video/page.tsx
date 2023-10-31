"use client";

import axios from "axios";

import * as z from "zod";
import Heading from "@/components/heading";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { MessageSquare, Music, Video, VideoIcon } from "lucide-react";

import { formSchema } from "./constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useState } from "react";
import OpenAI from "openai";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import Image from "next/image";

import { routes } from "../dashboard/page";
import { useProModal } from "@/hooks/use-pro-modal";
import toast from "react-hot-toast";

const VideoPage = () => {
  const router = useRouter();
  const [video, setVideo] = useState<string>("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const proModal = useProModal()
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setVideo("");

      const response = await axios.post("api/video", values);

      setVideo(response.data[0]);

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
        title="Video generation"
        description="The power of the AI in motion."
        icon={VideoIcon}
        iconColor="text-orange-700"
        bgColor="bg-orange-700/10"
      />
      <div className="px-4 lg:px-8">
        <div>
          {/* Using {...form} we set every property related to react-hook-form to the FORM component  */}
          <Form {...form}>
            {/* form with GRID display  */}
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              action=""
              className="rounded-lg border w-full p-4 px-3 md:px-6
            focus-within:shadow-sm grid grid-cols-12 gap-2"
            >
              <FormField
                name="prompt"
                render={({ field }) => (
                  <FormItem className="col-span-12 lg:col-span-10">
                    <FormControl className="m-0 p-0">
                      <Input
                        className="border-0 outline-none focus-visible:ring-0 
                        focus-visible:ring-transparent"
                        disabled={isLoading}
                        placeholder="A macro video of a bee pollinating a flower"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              {/* Responsive design using grid span */}
              <Button
                className="col-span-12 lg:col-span-2 w-full"
                disabled={isLoading}
              >
                Generate
              </Button>
            </form>
          </Form>
        </div>
        <div className="space-y-4 mt-4">
          {isLoading && (
            <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
              <Loader />
            </div>
          )}
          {video.length === 0 && !isLoading && (
            <Empty label="No video generated." />
          )}

          {video && (
            <video
              className="w-full aspect-video mt-8 rounded-lg border bg-black"
              controls
            >
              <source src={video} />
            </video>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoPage;
