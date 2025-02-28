import AppearanceSettings from "@/components/dashboard/user/settings/appearance-settings";
import NotificationSettings from "@/components/dashboard/user/settings/notification-settings";
import ShareXConfig from "@/components/dashboard/user/settings/sharex-config";
import UploadToken from "@/components/dashboard/user/settings/upload-token";
import UserSettings from "@/components/dashboard/user/settings/user-settings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getUser } from "@/lib/auth";
import { Metadata } from "next";

const tabs = [
  {
    id: "user",
    name: "User",
    description: "Manage your account settings and preferences.",
    content: () => <UserSettings />,
  },
  {
    id: "config",
    name: "Config",
    description: "Manage your upload client configurations.",
    content: (user: any) => (
      <div className="grid md:grid-cols-2 gap-2">
        <UploadToken uploadToken={user.uploadToken} />
        <ShareXConfig uploadToken={user.uploadToken} />
      </div>
    ),
  },
  {
    id: "notifications",
    name: "Notifications",
    description: "Manage your email notification settings.",
    content: () => <NotificationSettings />,
  },
  {
    id: "appearance",
    name: "Appearance",
    description: "Manage your website appearance settings.",
    content: () => <AppearanceSettings />,
  },
];

export const metadata: Metadata = {
  title: "Account Settings",
};

export default async function Dashboard() {
  const user = await getUser();
  return (
    <div className="mx-auto w-full max-w-5xl self-start flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1.5 select-none">
        <h1 className="text-2xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Settings */}
      <Tabs defaultValue={tabs[0].id}>
        {/* Headers */}
        <TabsList className="w-full h-full flex flex-wrap space-y--1 bg-transparent rounded-sm">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              className="flex-1 min-w-24 border-b border-border data-[state=active]:border-blue-500 data-[state=active]:text-blue-400 rounded-none hover:opacity-75 cursor-pointer transition-all transform-gpu"
              value={tab.id}
            >
              {tab.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Content */}
        {tabs.map((tab) => (
          <TabsContent
            key={tab.id}
            className="p-4 flex flex-col gap-4 bg-background/70 rounded-md border border-muted"
            value={tab.id}
          >
            {/* Tab Header */}
            <div className="flex flex-col gap-0.5 select-none">
              <h1 className="text-2xl font-bold">{tab.name}</h1>
              <p className="text-muted-foreground">{tab.description}</p>
            </div>

            {/* Tab Content */}
            {tab.content(user)}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
