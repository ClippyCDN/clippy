import { cn } from "@/lib/utils/utils";
import { Check, Loader2, XCircle } from "lucide-react";
import { ReactNode } from "react";

export type PreferenceProps = {
  className?: string;
  header: string;
  badge?: ReactNode;
  description: string;
  inline?: boolean;
  children: ReactNode;
};

export const statusIcons = {
  loading: <Loader2 className="size-4 text-muted-foreground animate-spin" />,
  success: <Check className="size-4 text-green-500" />,
  failed: <XCircle className="size-4 text-destructive" />,
};

export default function Preference({
  className,
  header,
  badge,
  description,
  inline,
  children,
}: PreferenceProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 justify-between",
        inline && "flex-row gap-10 items-center"
      )}
    >
      <div className="flex flex-col select-none">
        <div className="flex gap-3 items-center">
          <h1 className="text-sm xs:text-base font-bold transition-all transform-gpu">
            {header}
          </h1>
          {badge}
        </div>
        <p className="max-w-sm md:max-w-lg text-xs xs:text-sm text-muted-foreground transition-all transform-gpu">
          {description}
        </p>
      </div>
      <div className={cn("flex gap-2.5 items-center", className)}>
        {children}
      </div>
    </div>
  );
}

export function PreferenceCategory({
  name,
  children,
}: {
  name: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 select-none">
      <h2 className="text-lg xs:text-xl font-bold transition-all transform-gpu">
        {name}
      </h2>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  );
}
