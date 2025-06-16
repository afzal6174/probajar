// actions/submit-form.js
"use server";

import { loginSchema } from "@/schema/loginSchema";

export async function login(prevState, formData) {
  const values = Object.fromEntries(formData);

  const validated = loginSchema.safeParse({ values });

  if (!validated.success) {
    const errors = validated.error.flatten().fieldErrors;
    return { success: false, errors }; // { email: ["..."], password: ["..."] }
  }

  // Success
  return { success: true };
}
