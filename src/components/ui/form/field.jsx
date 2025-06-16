"use client";

import { cn } from "@/lib/utils/cn";
import * as React from "react";
import { useForm } from "./form";
import { Label } from "./label";

const FieldContext = React.createContext({});

const fieldReducer = (state, action) => {
  switch (action.type) {
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "CLEAR_ERROR":
      return { ...state, error: null };
    default:
      throw new Error(`No action matched with ${action.type}`);
  }
};

const Field = ({ name, className, ...props }) => {
  const [state, dispatch] = React.useReducer(fieldReducer, { error: null });
  const id = React.useId();
  const { errors } = useForm();
  return (
    <FieldContext.Provider
      value={{
        name,
        error: state?.error || errors?.[name]?.[0],
        fieldId: `field-${id}`,
        fieldDescriptionId: `field-${id}-description`,
        fieldMessageId: `field-${id}-message`,
        dispatch,
        ...state,
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

const useField = () => {
  const fieldContext = React.useContext(FieldContext);

  if (!fieldContext) {
    throw new Error("useField should be used within <Field>");
  }

  return fieldContext;
};

function FieldLabel({ className, ...props }) {
  const { error, fieldId } = useField();
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
  const { fieldDescriptionId } = useField();
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
  const { error, fieldMessageId } = useField();
  const body = error ? String(error) : props.children;

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

export { Field, FieldDescription, FieldLabel, FieldMessage, useField };
