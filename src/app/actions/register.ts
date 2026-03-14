"use server";

import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function registerUser(formData: FormData) {
  try {
    const rawData = Object.fromEntries(formData.entries());
    const result = registerSchema.safeParse(rawData);

    if (!result.success) {
      return {
        error: "Invalid field values.",
        fieldErrors: result.error.flatten().fieldErrors,
      };
    }

    const { name, email, password } = result.data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "A user with this email already exists." };
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("FULL REGISTRATION ERROR:", error);
    
    // Check for specific Prisma errors
    if (error.code === 'P2002') {
      return { error: "A user with this email already exists." };
    }
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    return { error: `Registration failed: ${errorMessage}` };
  }
}
