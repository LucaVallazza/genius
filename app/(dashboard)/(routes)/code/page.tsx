"use client";

import axios from "axios";

import * as z from "zod";
import Heading from "@/components/heading";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";

import { Code, Divide, MessageSquare } from "lucide-react";

import { formSchema } from "./constants";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import React, { useState } from "react";
import OpenAI from "openai";
import { Empty } from "@/components/empty";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { UserAvatar } from "@/components/user-avatar";
import { BotAvatar } from "@/components/bot-avatar";

import ReactMarkdown from "react-markdown";
import { useProModal } from "@/hooks/use-pro-modal";
import ProModal from "@/components/pro-modal";
import toast from "react-hot-toast";

const CodePage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<
    OpenAI.Chat.CreateChatCompletionRequestMessage[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const [errorCount, setErrorCount] = useState(0)
  const isLoading = form.formState.isSubmitting;
  const proModal = useProModal()

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const userMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };

      const newMessages = [...messages, userMessage];

      // We send the message and look for the response
      const response = await axios.post("/api/code", {
        messages: newMessages,
      });

      await setMessages((current) => [...current, userMessage, response.data]);

      form.reset();
    } catch (error) {
      if(error?.response?.status === 403){
        proModal.onOpen()
      }else{
        if(errorCount < 3){
          toast.error('Something went wrong')
          setErrorCount(errorCount + 1)
        }else{
          toast.error('Something is not working. Please refresh the page or try again later')
        }
      }
      console.log(error);
    } finally {
      router.refresh();
    }
  };

  return (
    <div>
      <Heading
        title="Code generation"
        description="Generate code using AI."
        icon={Code}
        iconColor="text-green-700"
        bgColor="bg-green-700/10"
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
                        placeholder="Create a simple toggle button using react"
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
          {messages.length === 0 && !isLoading && (
            <Empty label="No conversation started." />
          )}

          <div className="flex flex-col-reverse gap-y-4">
            {messages.map((message) => (
              //Show messages
              <div
                key={message.content}
                className={cn(
                  "p-8 w-full flex items-start gap-x-8 rounded-lg border",
                  message.role === "user" ? "bg-white" : "bg-gray-200 "
                )}
              >
                {message.role === "user" ? (
                  <>
                    <UserAvatar />
                    <p>{message.content}</p>
                  </>
                ) : (
                  <>
                    <BotAvatar />
                    <ReactMarkdown
                      components={{
                        pre: ({ node, ...props }) => (
                          <div className=" text-white/90 overflow-auto w-full my-2 bg-slate-950/60 p-2 rounded-lg">
                            <pre {...props} />
                          </div>
                        ),
                        code: ({ node, ...props }) => (
                          <code
                            className="bg-slate-950/10 rounded-lg p-1"
                            {...props}
                          ></code>
                        ),
                      }}
                      className="text-sm overflow-hidden leading-7"
                    >
                      {message.content || ""}
                    </ReactMarkdown>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePage;
