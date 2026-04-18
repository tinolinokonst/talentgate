import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
});

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128),
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100)
    .trim(),
});

export const postRoleSchema = z
  .object({
    title: z.string().min(3).max(100).trim(),
    description: z.string().min(20).max(5000).trim(),
    location: z.string().max(200).trim(),
    salaryMin: z.number().min(0).max(10_000_000).nullable(),
    salaryMax: z.number().min(0).max(10_000_000).nullable(),
    qualifications: z.string().max(2000).trim(),
    deadline: z.string().optional(),
  })
  .refine(
    (data) =>
      !data.salaryMin || !data.salaryMax || data.salaryMax >= data.salaryMin,
    {
      message: "Max salary must be greater than min salary",
      path: ["salaryMax"],
    }
  );

export const workerProfileSchema = z.object({
  experienceSummary: z.string().max(2000).trim(),
  previousRoles: z.string().max(2000).trim(),
  biggestAchievement: z.string().max(1000).trim(),
  whatYouGoodAt: z.string().max(1000).trim(),
  skills: z.array(z.string().max(50)).max(30),
});

export const businessProfileSchema = z.object({
  companyName: z.string().min(2).max(100).trim(),
  description: z.string().max(2000).trim(),
  website: z.string().url("Invalid URL").or(z.literal("")).optional(),
});
