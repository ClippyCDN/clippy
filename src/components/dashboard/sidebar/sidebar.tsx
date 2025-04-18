"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { config } from "@/config";
import { cn } from "@/lib/utils/utils";
import {
  Bell,
  FolderOpen,
  Github,
  Heart,
  Home,
  ImageIcon,
  Link2,
  Lock,
  NotebookText,
  Palette,
  Settings,
  Sticker,
  User,
  Video,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactElement } from "react";

type Item = {
  title: string;
  url: string;
  icon: ReactElement;
};

type Group = {
  title?: string;
  items: Item[];
};

const groups: Group[] = [
  {
    title: "Overview",
    items: [
      {
        title: "Home",
        url: "/dashboard",
        icon: <Home />,
      },
    ],
  },
  {
    title: "Files",
    items: [
      {
        title: "All Files",
        url: "/dashboard/files",
        icon: <FolderOpen />,
      },
      {
        title: "Favorites",
        url: "/dashboard/files/favorited",
        icon: <Heart />,
      },
      {
        title: "Videos",
        url: "/dashboard/files/videos",
        icon: <Video />,
      },
      {
        title: "Images",
        url: "/dashboard/files/images",
        icon: <ImageIcon />,
      },
      {
        title: "GIFs",
        url: "/dashboard/files/gifs",
        icon: <Sticker />,
      },
    ],
  },
  {
    title: "Short Links",
    items: [
      {
        title: "Links",
        url: "/dashboard/short-links",
        icon: <Link2 />,
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        title: "User",
        url: "/dashboard/account/settings/user",
        icon: <User />,
      },
      {
        title: "Security",
        url: "/dashboard/account/settings/security",
        icon: <Lock />,
      },
      {
        title: "Config",
        url: "/dashboard/account/settings/config",
        icon: <Settings />,
      },
      {
        title: "Notifications",
        url: "/dashboard/account/settings/notifications",
        icon: <Bell />,
      },
      {
        title: "Appearance",
        url: "/dashboard/account/settings/appearance",
        icon: <Palette />,
      },
    ],
  },
];

const socials: Item[] = [
  {
    title: "GitHub",
    url: config.githubUrl,
    icon: <Github />,
  },
  {
    title: "Documentation",
    url: config.documentationUrl,
    icon: <NotebookText />,
  },
];

export default function AppSidebar() {
  const path: string = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <div className="h-[90dvh] overflow-hidden">
      <Sidebar className="top-[var(--header-height)] select-none">
        {/* Groups */}
        <SidebarContent className="gap-0">
          {groups.map((group, index) => {
            return (
              <SidebarGroup key={index}>
                {group.title && (
                  <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                )}
                <SidebarGroupContent>
                  <SidebarMenu className="gap-0.5">
                    {group.items.map((item, index) => {
                      const active: boolean = path === item.url;
                      return (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton
                            className={cn(
                              active &&
                                "bg-primary/85 hover:bg-primary/90 text-sidebar-accent-foreground"
                            )}
                            asChild
                            onClick={() => {
                              if (isMobile) {
                                setOpenMobile(false);
                              }
                            }}
                          >
                            <Link
                              href={item.url}
                              prefetch={false}
                              draggable={false}
                            >
                              <span className={cn("*:size-4")}>
                                {item.icon}
                              </span>
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          })}
        </SidebarContent>

        {/* Social Links */}
        <SidebarFooter className={cn("gap-0", !isMobile && "pb-14")}>
          <div className="bg-zinc-800/75 rounded-lg p-2">
            {socials.map(item => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link
                    href={item.url}
                    target="_blank"
                    prefetch={false}
                    draggable={false}
                  >
                    <span className="*:size-4">{item.icon}</span>
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
