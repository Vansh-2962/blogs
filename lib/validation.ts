import { z } from "zod";

export const blogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, { message: "Title must be at least 3 characters long" }),
  subTitle: z
    .string()
    .trim()
    .min(3, { message: "Subtitle must be at least 3 characters long" }),
  coverImg: z.string().url(),
  content: z
    .string()
    .trim()
    .min(10, { message: "Content must be at least 10 characters long" }),
  category: z.string(),
});
