"use client";

import BooleanPreference from "@/components/dashboard/user/settings/types/boolean-preference";
import InputPreference from "@/components/dashboard/user/settings/types/input-preference";
import { Badge } from "@/components/ui/badge";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils/utils";
import { usePreferences } from "@/providers/preferences-provider";

export default function PreferenceSettings({ user }: { user: UserType }) {
  const { preferences } = usePreferences();
  const hasWebhookUrl: boolean = !!preferences?.webhookUrl;
  return (
    <div className="flex flex-col gap-4">
      <BooleanPreference
        preferenceId="showKitty"
        header="Show Kitty"
        description="Would you like to see the little kitty running around the screen? (:"
      />
      <InputPreference
        preferenceId="webhookUrl"
        header="Webhook URL"
        badge={
          <Badge
            className={cn(hasWebhookUrl && "bg-green-500")}
            variant={hasWebhookUrl ? "default" : "destructive"}
          >
            {hasWebhookUrl ? "Active" : "Inactive"}
          </Badge>
        }
        description={`The webhook URL to send ${env.NEXT_PUBLIC_WEBSITE_NAME} events to.`}
        placeholder="https://discord.com/api/webhooks/..."
        valueRegex={
          /^https:\/\/discord\.com\/api\/webhooks\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+$/
        }
      />
    </div>
  );
}
