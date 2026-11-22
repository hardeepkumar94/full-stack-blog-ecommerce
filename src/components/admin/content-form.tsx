import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface Field {
  label: string;
  name: string;
  type?: "text" | "number" | "url" | "textarea";
  placeholder: string;
}

interface ContentFormProps {
  action: (formData: FormData) => Promise<void>;
  fields: Field[];
  submitLabel: string;
}

export default function ContentForm({
  action,
  fields,
  submitLabel,
}: ContentFormProps) {
  return (
    <form action={action} className="space-y-5">
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
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
