"use server";

import prisma from "@/lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Validation Schemas
const sendOTPSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be exactly 6 digits"),
  newPassword: z.string().min(8, "Password must be at least 8 characters long"),
});

export async function sendOTP(formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email") as string,
    };

    const validatedData = sendOTPSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    const { email } = validatedData.data;

    // Verify user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return a generic success to prevent email enumeration
      return { success: true, message: "If the email is registered, an OTP was sent." };
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await prisma.user.update({
      where: { email },
      data: {
        otpToken: otp,
        otpExpiry: expiry,
      },
    });

    // In a production app, we would send the email via Resend/SendGrid here.
    // For this hackathon, we'll log it out to the terminal so we can copy-paste it for demo purposes.
    console.log(`\n\n[MAIL MOCK] -> To: ${email} | Subject: Password Reset OTP`);
    console.log(`Your CoreInventory OTP is: ${otp}`);
    console.log(`This code expires in 15 minutes.\n\n`);

    return { success: true, message: "OTP sent successfully." };

  } catch (error) {
    console.error("Failed to send OTP:", error);
    return { success: false, error: "System error occurred while generating OTP" };
  }
}

export async function verifyOTPAndResetPassword(formData: FormData) {
  try {
    const rawData = {
      email: formData.get("email") as string,
      otp: formData.get("otp") as string,
      newPassword: formData.get("newPassword") as string,
    };

    const validatedData = resetPasswordSchema.safeParse(rawData);
    if (!validatedData.success) {
      return { success: false, error: validatedData.error.issues[0].message };
    }

    const { email, otp, newPassword } = validatedData.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { success: false, error: "Invalid credentials." };
    }

    if (!user.otpToken || !user.otpExpiry) {
      return { success: false, error: "No OTP was requested for this email." };
    }

    if (user.otpToken !== otp) {
      return { success: false, error: "Invalid OTP code." };
    }

    if (new Date() > user.otpExpiry) {
      return { success: false, error: "OTP has expired. Please request a new one." };
    }

    // OTP matches and is valid -> Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user and clear OTP fields
    await prisma.user.update({
      where: { email },
      data: {
        password: hashedPassword,
        otpToken: null,
        otpExpiry: null,
      },
    });

    return { success: true, message: "Password reset successfully! You can now log in." };

  } catch (error) {
    console.error("Failed to reset password:", error);
    return { success: false, error: "System error occurred while resetting password." };
  }
}
