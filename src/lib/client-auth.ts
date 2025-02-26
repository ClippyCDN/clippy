import {
  adminClient,
  inferAdditionalFields,
  usernameClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "./auth";
import { env } from "./env";

export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_WEBSITE_URL,
  plugins: [
    usernameClient(),
    adminClient(),
    inferAdditionalFields<typeof auth>(),
  ],
});
