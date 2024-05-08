"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { ScrollBar } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { ArrowBigLeftIcon, ArrowLeftIcon, ArrowRightIcon, Star } from "lucide-react";
import { ScrollArea } from "@mantine/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation   } from 'swiper/modules';

import 'swiper/css';
import "swiper/css/navigation"
import "swiper/css/pagination"

const LandingContent = () => {
  const [arrowsVisible, setArrowsVisible] = useState(false);


  const testimonials = [
    {
      name: "Sophia",
      avatar: "S",
      title: "Content Creator",
      description: "This AI app is a game-changer for content creation!",
      stars: 5
    },
    {
      name: "David",
      avatar: "D",
      title: "Blogger",
      description: "I'm amazed by the quality of content it generates.",
      stars: 4
    },
    {
      name: "Isabel",
      avatar: "I",
      title: "Digital Marketer",
      description: "This app has revolutionized our marketing efforts.",
      stars: 4
    },
    {
      name: "Michael",
      avatar: "M",
      title: "Tech Enthusiast",
      description: "The AI's creativity knows no bounds. Impressive!",
      stars: 5
    },
    {
      name: "Sabrina",
      avatar: "S",
      title: "Tech Enthusiast",
      description: "The AI's creativity is simply mind-blowing. I can't get enough of it!",
      stars: 5
    },
    {
      name: "Edward",
      avatar: "E",
      title: "Marketing Manager",
      description: "The AI has greatly improved our marketing campaigns. It's a game-changer!",
      stars: 4
    },
    {
      name: "Ava",
      avatar: "A",
      title: "Writer",
      description: "Impressive AI! It has significantly boosted my writing productivity.",
      stars: 4
    },
    {
      name: "Oliver",
      avatar: "O",
      title: "Business Owner",
      description: "I can't believe the impact this AI has had on my business. A solid 5 stars!",
      stars: 5
    },
    {
      name: "Mia",
      avatar: "M",
      title: "Student",
      description: "Using this AI has made my school projects a breeze. 5-star performance!",
      stars: 5
    },
    {
      name: "Liam",
      avatar: "L",
      title: "App Developer",
      description: "As a developer, I'm impressed by the technical prowess of this AI. 5 stars!",
      stars: 5
    }
];

  const scrollHandler = (e: any) => {};

  return (
    <div className="px-10 pb-20">
      <h2 className="text-4xl text-white font-extrabold mb-10 text-center ">
        Testimonials
      </h2>

      <Swiper
        modules={[Pagination]}
        pagination
        grabCursor
        spaceBetween={5}
        slidesPerView={1}
        breakpoints={{
          580:{
            spaceBetween:5,
            slidesPerView:2,
          },
          850:{
            spaceBetween:5,
            slidesPerView:3,
          },
          1000:{
            spaceBetween:10,
            slidesPerView:4,
          }
        }}
        centerInsufficientSlides
        onSlideChange={() => console.log("slide change")}
        onSwiper={(swiper: any) => console.log(swiper)}

        className="h-72"
      >


        {testimonials.map((item) => (
          <SwiperSlide key={item.description}>
            <Card
              className="bg-[#192339] border-none w-[25ch] h-5/6 text-white"
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-x-2">
                  <div>
                    <p className="text-lg">{item.name}</p>
                    <p className="text-zinc-400 text-sm">{item.title}</p>
                  </div>
                </CardTitle>
                <div className="pb-2 relative mr-auto flex flex-row"> 
                 <Star className={"w-4 h-4 fill-" + (item.stars >= 1 ? "white" : "none")} />
                 <Star className={"w-4 h-4 fill-" + (item.stars >= 2 ? "white" : "none")} />
                 <Star className={"w-4 h-4 fill-" + (item.stars >= 3 ? "white" : "none")} />
                 <Star className={"w-4 h-4 fill-" + (item.stars >= 4 ? "white" : "none")} />
                 <Star className={"w-4 h-4 fill-" + (item.stars >= 5 ? "white" : "none")} />
                </div>
                <Separator className="bg-zinc-700 mb-0"></Separator>
              </CardHeader>
              <CardContent className="-mt-4 px-6 h-full">
                <p className="">{item.description}</p>
              </CardContent>
            </Card>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="flex w-max space-x-4 px-20 "></div>
    </div>
  );
};

export default LandingContent;
