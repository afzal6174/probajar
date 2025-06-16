"use client";

import { cn } from "@/lib/utils/cn";
import * as React from "react";

const FormContext = React.createContext({});

const Form = ({ action = () => {}, className, ...props }) => {
  const initialState = { message: null, errors: {} };
  const [state, formAction, isPending] = React.useActionState(
    action,
    initialState
  );

  const id = React.useId();
  const formId = `form-${id}`;
  const formTitleId = `form-${id}-title`;
  return (
    <FormContext.Provider
      value={{
        errors: state?.errors,
        message: state?.message,
        formId,
        formTitleId,
        formDescriptionId: `form-${id}-description`,
        formMessageId: `form-${id}-message`,
        isPending,
        ...state,
      }}
    >
      <form
        id={formId}
        data-slot="form"
        action={formAction}
        aria-labelledby={formTitleId}
        className={cn("flex flex-col gap-6", className)}
        {...props}
      />
    </FormContext.Provider>
  );
};

const useForm = () => {
  const formContext = React.useContext(FormContext);

  if (!formContext) {
    throw new Error("useForm should be used within <Form>");
  }

  return formContext;
};

function FormTitle({ className, ...props }) {
  const { error, formTitleId } = useForm();
  return (
    <h2
      data-slot="form-title"
      data-error={!!error}
      className={cn(
        "data-[error=true]:text-destructive leading-none font-semibold",
        className
      )}
      id={formTitleId}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }) {
  const { formDescriptionId } = useForm();
  return (
    <p
      data-slot="form-description"
      id={formDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }) {
  const { message, formMessageId } = useForm();
  const body = message ? String(message) : props.children;

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={formMessageId}
      className={cn("text-destructive text-sm", className)}
      role="alert"
      aria-live="polite"
      aria-atomic="true"
      {...props}
    >
      {body}
    </p>
  );
}

export { Form, FormDescription, FormMessage, FormTitle, useForm };
