import { LinkIcon } from "@heroicons/react/24/outline";
import { formStyles } from "@/components/admin/shared/formStyles";
import { cn } from "@/lib/utils";

interface LinkInputRowProps {
  text: string;
  url: string;
  onTextChange: (text: string) => void;
  onUrlChange: (url: string) => void;
  onAdd: () => void;
}

export function LinkInputRow({
  text,
  url,
  onTextChange,
  onUrlChange,
  onAdd,
}: LinkInputRowProps) {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Label (e.g. GitHub)"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        className={cn(formStyles.input, "py-2 text-sm")}
      />
      <input
        type="text"
        placeholder="https://..."
        value={url}
        onChange={(e) => onUrlChange(e.target.value)}
        className={cn(formStyles.input, "py-2 text-sm")}
      />
      <button
        type="button"
        onClick={onAdd}
        className="rounded-lg bg-primary p-2 text-primary-foreground transition-opacity hover:opacity-90"
      >
        <LinkIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
