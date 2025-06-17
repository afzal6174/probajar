"use client";

import { cn } from "@/lib/utils/cn";
import * as React from "react";
import { useFormContext } from "./form";
import { Label } from "./label";

const FieldContext = React.createContext(null);

const Field = ({ name, className, ...props }) => {
  const id = React.useId();
  const { clientState, serverState } = useFormContext();
  const clientError = clientState?.errors?.[name]?.[0]?.message;
  const serverError = serverState?.errors?.[name]?.[0]?.message;
  const error = clientError ?? serverError;
  return (
    <FieldContext.Provider
      value={{
        name,
        error,
        fieldId: `field-${id}`,
        fieldDescriptionId: `field-${id}-description`,
        fieldMessageId: `field-${id}-message`,
      }}
    >
      <div
        data-slot="form-field"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FieldContext.Provider>
  );
};

const useFieldContext = () => {
  const fieldContext = React.useContext(FieldContext);

  if (!fieldContext) {
    throw new Error("useFieldContext should be used within <Field>");
  }

  return fieldContext;
};

function FieldLabel({ className, ...props }) {
  const { error, fieldId } = useFieldContext();
  return (
    <Label
      data-slot="form-label"
      data-error={!!error}
      className={cn("data-[error=true]:text-destructive", className)}
      htmlFor={fieldId}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }) {
  const { fieldDescriptionId } = useFieldContext();
  return (
    <p
      data-slot="form-description"
      id={fieldDescriptionId}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FieldMessage({ className, ...props }) {
  const { error, fieldMessageId } = useFieldContext();
  const body = props.children ?? (error && String(error));

  if (!body) {
    return null;
  }

  return (
    <p
      data-slot="form-message"
      id={fieldMessageId}
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

export { Field, FieldDescription, FieldLabel, FieldMessage, useFieldContext };
