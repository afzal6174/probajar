"use client";

import { cn } from "@/lib/utils/cn";
import { getDraft, saveDraft } from "@/lib/utils/draftStorage";
import * as React from "react";
import { useFormContext } from ".";
import { useFieldContext } from "./field";

function Input({ className, type, defaultValue, validation, ...props }) {
  const { name, error, fieldId, fieldDescriptionId, fieldMessageId } =
    useFieldContext();
  const { formId, dispatch } = useFormContext();

  const DRAFT_KEY = `draft-${formId}-${name}-${fieldId}`;
  const [value, setValue] = React.useState("");

  React.useEffect(() => {
    React.startTransition(async () => {
      const draft = await getDraft(DRAFT_KEY);
      setValue(draft || defaultValue || "");
    });
  }, [DRAFT_KEY]);

  const validateField = (fieldName, fieldValue) => {
    const result = validation.safeParse({ [fieldName]: fieldValue });

    if (result.success) {
      dispatch({ type: "CLEAR_ERROR", payload: name });
    } else {
      dispatch({
        type: "SET_ERROR",
        // payload: result.error.errors[0]?.message,
        payload: { [fieldName]: result.error.errors },
      });
    }
  };

  const handleChange = async (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    await saveDraft(newValue, DRAFT_KEY);
    if (validation) {
      validateField(name, newValue);
    }
  };

  return (
    <input
      id={fieldId}
      name={name}
      type={type}
      data-slot="input"
      value={value}
      onChange={handleChange}
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      aria-describedby={
        !error
          ? `${fieldDescriptionId}`
          : `${fieldDescriptionId} ${fieldMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
}

export default Input;
