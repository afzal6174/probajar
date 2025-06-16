"use client";

import { login } from "@/actions/login-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Field,
  FieldLabel,
  FieldMessage,
  Form,
  FormDescription,
  FormTitle,
  Input,
  useForm,
} from "@/components/ui/form";
import { loginSchema } from "@/schema/loginSchema";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm() {
  const { isPending } = useForm();
  console.log(isPending);
  const [visible, setVisible] = useState(false);
  return (
    <Card className="w-full max-w-sm">
      <Form action={login}>
        <CardHeader>
          <FormTitle>Login to your account</FormTitle>
          <FormDescription>
            Enter your email below to login to your account
          </FormDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <Field name="email" className="grid gap-2">
              <FieldLabel>Email</FieldLabel>
              <Input
                type="email"
                placeholder="example@email.com"
                validation={loginSchema.pick({ email: true })}
              />
              <FieldMessage />
            </Field>

            <Field name="password" className="grid gap-2">
              <div className="flex items-center">
                <FieldLabel>Password</FieldLabel>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={visible ? "text" : "password"}
                  placeholder="********"
                  validation={loginSchema.pick({ password: true })}
                />
                <Button
                  type="button"
                  onClick={() => setVisible((v) => !v)}
                  className="absolute right-2 top-0 bg-muted text-muted-foreground"
                  tabIndex={-1}
                >
                  {visible ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
              <FieldMessage />
            </Field>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" disabled={isPending} className="w-full">
            Login
          </Button>
          <Button variant="outline" className="w-full">
            Login with Google
          </Button>
        </CardFooter>
      </Form>
    </Card>
  );
}
