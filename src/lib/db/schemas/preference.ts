import { boolean, jsonb, pgTable, serial, text } from "drizzle-orm/pg-core";
import { users } from "./auth-schema";

export const defaultNotifications: Notifications = {
  uploadFile: {
    sendWebhook: true,
    sendMail: true,
  },
  deleteFile: {
    sendWebhook: true,
    sendMail: true,
  },
  resetUploadToken: {
    sendWebhook: true,
    sendMail: true,
  },
};

export type NotificationState = {
  sendWebhook: boolean;
  sendMail: boolean;
};

export type Notifications = {
  uploadFile: NotificationState;
  deleteFile: NotificationState;
  resetUploadToken: NotificationState;
};

export const preferencesTable = pgTable("preferences", {
  id: serial("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id)
    .unique(),

  // Preferences
  showKitty: boolean("show_kitty"),
  webhookUrl: text("webhook_url"),
  notifications: jsonb("notifications")
    .$type<Notifications>()
    .notNull()
    .default(defaultNotifications),
});

export type PreferencesType = Omit<
  typeof preferencesTable.$inferSelect,
  "id" | "userId"
>;
