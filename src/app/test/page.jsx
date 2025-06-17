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
  FormMessage,
  FormTitle,
  Input,
} from "@/components/ui/form";
import errorReducer from "@/components/ui/form/reducer";
import { loginSchema } from "@/schema/loginSchema";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useActionState, useReducer, useState } from "react";

export default function LoginForm() {
  const initialState = { message: null, errors: {} };
  const [serverState, formAction, isPending] = useActionState(
    login,
    initialState
  );
  const [clientState, dispatch] = useReducer(errorReducer, { errors: {} });
  const state = {
    serverState,
    clientState,
    isPending,
  };

  const [visible, setVisible] = useState(false);
  return (
    <Card className="w-full max-w-sm">
      <Form action={formAction} state={state} dispatch={dispatch}>
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
                  size="icon"
                  variant="ghost"
                  onClick={() => setVisible((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-auto w-auto"
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
          <FormMessage />
        </CardFooter>
      </Form>
    </Card>
  );
}
