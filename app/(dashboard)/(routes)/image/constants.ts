import * as z from "zod";

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Image prompt is required",
  }),
  negative_prompt: z.string(),  
  samples: z.string().min(1),
  resolution: z.string().min(1),
});

export const samplesOption = [
  {
    value: "1",
    label: "1 Photo",
  },
  {
    value: "2",
    label: "2 Photos",
  },
  {
    value: "3",
    label: "3 Photos",
  },
  {
    value: "4",
    label: "4 Photos",
  },
  {
    value: "5",
    label: "5 Photos",
  },
];

export const resolutionOptions = [
    {
        value: "256",
        label: "256x256"
    },
    {
        value: "512",
        label: "512x512"
    },
    {
        value: "1024",
        label: "1024x1024"
    }
];
