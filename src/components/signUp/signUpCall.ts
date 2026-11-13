"use server";

import axios from "axios";

export type SignUpValues = {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
};

export type SignUpResult = {
  ok: boolean;
  message: string;
};

export default async function SignUpCall(data: SignUpValues): Promise<SignUpResult> {
  try {
    const response = await axios.post<{ message?: string }>(
      "https://ecommerce.routemisr.com/api/v1/auth/signup",
      data,
    );
    return {
      ok: true,
      message: response.data.message ?? "Account created",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const body = error.response?.data as { message?: unknown } | undefined;
      if (typeof body?.message === "string" && body.message) {
        return { ok: false, message: body.message };
      }
    }
    return { ok: false, message: "We could not create your account. Try again." };
  }
}
