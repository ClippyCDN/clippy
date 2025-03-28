import ConfirmationPopover from "@/components/confirmation-popover";
import SimpleTooltip from "@/components/simple-tooltip";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { authClient } from "@/lib/client-auth";
import { DATE_FORMATS, formatDate, formatTimeAgo } from "@/lib/utils/date";
import { Session } from "better-auth";
import { LogOut, Monitor, Smartphone } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UAParser } from "ua-parser-js";

export default function Device({
  currentSession,
  session,
}: {
  currentSession: Session;
  session: Session;
}) {
  const router: AppRouterInstance = useRouter();
  const isCurrentSession: boolean = currentSession.token === session.token;
  const { device, browser } = session.userAgent
    ? UAParser(session.userAgent)
    : { device: null, browser: null };
  const isMobile: boolean = device?.is("mobile") ?? false;
  let browserName: string = browser?.name ?? "An Unknown Browser";
  if (isMobile) {
    browserName = browserName.substring(7);
  }
  const name: string = `${isMobile ? "Mobile" : "Desktop"} Device on ${browserName}`;
  const ipAddress: string =
    (session.ipAddress?.length ?? 0 <= 4)
      ? "localhost"
      : (session.ipAddress ?? "Unknown");

  async function logoutDevice() {
    await authClient.revokeSession({
      token: session.token,
    });
    if (isCurrentSession) router.refresh();
  }

  return (
    <>
      <div className="group relative p-2.5 w-full h-14 flex gap-3 items-center select-none">
        {/* Device & Browser Icons */}
        <SimpleTooltip content={name}>
          <div className="relative size-9 flex justify-center items-center bg-muted rounded-full">
            {/* Device */}
            <div className="*:size-5">
              {isMobile ? <Smartphone /> : <Monitor />}
            </div>

            {/* Browser */}
            <Image
              className="absolute bottom-0 right-0 p-0.5 bg-muted rounded-full"
              src={`/browser/${browserName.toLowerCase()}.svg`}
              alt={browserName}
              width={16}
              height={16}
              draggable={false}
              unoptimized
            />
          </div>
        </SimpleTooltip>

        <div className="flex flex-col gap-0.5">
          {/* Name & Current Badge */}
          <div className="flex gap-2 items-center">
            <h1 className="text-sm font-medium">{name}</h1>

            {/* Current Session Badge */}
            {isCurrentSession && (
              <SimpleTooltip content="Oh look, it's you!">
                <Badge className="py-0 text-xs hover:opacity-75 transition-all transform-gpu">
                  Current
                </Badge>
              </SimpleTooltip>
            )}
          </div>

          {/* IP Address & Login Date */}
          <div className="flex gap-1 items-center text-xs text-muted-foreground">
            {ipAddress} -{" "}
            <SimpleTooltip
              content={`Device logged in on ${formatDate(session.createdAt, DATE_FORMATS.DATE_TIME)}`}
            >
              <span className="cursor-pointer hover:opacity-75 transition-all transform-gpu">
                {formatTimeAgo(session.createdAt)}
              </span>
            </SimpleTooltip>
          </div>
        </div>

        {/* Actions */}
        <div className="lg:opacity-0 group-hover:opacity-100 ml-auto flex gap-2 items-center transition-all duration-300 transform-gpu">
          {/* Logout */}
          <SimpleTooltip content="Logout Device">
            <div>
              <ConfirmationPopover
                message="Are you sure you would like to logout this device?"
                confirmationButton="Logout Device"
                onConfirm={logoutDevice}
              >
                <Button variant="ghost" size="icon" onClick={logoutDevice}>
                  <LogOut className="size-4 text-muted-foreground" />
                </Button>
              </ConfirmationPopover>
            </div>
          </SimpleTooltip>
        </div>
      </div>
      <Separator />
    </>
  );
}
