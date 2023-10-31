"use client";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { ScrollBar } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

const LandingContent = () => {
  const testimonials = [
    {
      name: "Sophia",
      avatar: "S",
      title: "Content Creator",
      description: "This AI app is a game-changer for content creation!",
    },
    {
      name: "David",
      avatar: "D",
      title: "Blogger",
      description: "I'm amazed by the quality of content it generates.",
    },
    {
      name: "Isabel",
      avatar: "I",
      title: "Digital Marketer",
      description: "This app has revolutionized our marketing efforts.",
    },
    {
      name: "Michael",
      avatar: "M",
      title: "Tech Enthusiast",
      description: "The AI's creativity knows no bounds. Impressive!",
    },
    {
      name: "Sabrina",
      avatar: "S",
      title: "Tech Enthusiast",
      description: "The AI's creativity knows no bounds. Impressive!",
    },
    {
      name: "Edward",
      avatar: "E",
      title: "Tech Enthusiast",
      description: "The AI's creativity knows no bounds. Impressive!",
    },
  ];

  return (
    <div className="px-10 pb-20">
      <h2 className="text-4xl text-white font-extrabold mb-10 text-center ">
        Testimonials
      </h2>
      <ScrollArea className="w-full rounded-md overflow-hidden">
        <span className="h-full w-10 md:w-28 absolute bg-gradient-to-r from-[#111827] to-transparent"></span>
        <span className="h-full w-10 md:w-28 absolute right-0 bg-gradient-to-l from-[#111827] to-transparent"></span>
        <div className="flex w-max space-x-4 px-20 ">
          {testimonials.map((item) => (
            <Card
              key={item.description}
              className="bg-[#192339] border-none w-[30ch] text-white shrink-0"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-x-2">
                  <div>
                    <p className="text-lg">{item.name}</p>
                    <p className="text-zinc-400 text-sm">{item.title}</p>
                  </div>
                </CardTitle>
                <Separator className="bg-zinc-700"></Separator>
              </CardHeader>
              <CardContent className="px-6 h-auto">
                <p className="">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default LandingContent;
