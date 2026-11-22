"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ContentActionState } from "@/lib/admin/actions";
import { useActionState, useEffect, useRef } from "react";

interface Field {
  label: string;
  name: string;
  type?: "text" | "number" | "url" | "textarea";
  placeholder: string;
}

interface ContentFormProps {
  action: (
    previousState: ContentActionState,
    formData: FormData,
  ) => Promise<ContentActionState>;
  fields: Field[];
  submitLabel: string;
}

export default function ContentForm({
  action,
  fields,
  submitLabel,
}: ContentFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(action, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-5">
      {state.message && (
        <Alert variant={state.success ? "success" : "destructive"}>
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      {fields.map((field) => (
        <label key={field.name} className="block">
          <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.label}
          </span>
          {field.type === "textarea" ? (
            <Textarea
              name={field.name}
              placeholder={field.placeholder}
              required
              rows={field.name === "content" ? 8 : 4}
            />
          ) : (
            <Input
              name={field.name}
              type={field.type ?? "text"}
              placeholder={field.placeholder}
              required={field.type !== "url"}
              min={field.type === "number" ? "0.01" : undefined}
              step={field.type === "number" ? "0.01" : undefined}
            />
          )}
        </label>
      ))}
      <Button type="submit" disabled={pending}>
        {pending ? "Publishing..." : submitLabel}
      </Button>
    </form>
  );
}
