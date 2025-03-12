import AvatarInitials from "@/components/avatar-initials";
import ConfirmationPopover from "@/components/confirmation-popover";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ActivityGraph from "@/components/user/activity-graph";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { getUserRole } from "@/lib/helpers/role";
import { format } from "date-fns";

export default function UserSettings({ user }: { user: UserType }) {
  return (
    <div className="flex flex-col gap-4">
      <UserDetails user={user} />
      <Separator />
      <ActivityGraph
        header="Your Activity"
        description="A graph of your upload activity over the past year."
        userId={user.id}
      />
      <Separator />
      <DangerZone />
    </div>
  );
}

function UserDetails({ user }: { user: any }) {
  const createdAt = `Created on ${format(user.createdAt, "MMM dd, yyyy")}`;
  return (
    <div className="flex gap-3 items-center select-none">
      {/* Avatar */}
      <div>
        <AvatarInitials name={user.username} />
      </div>

      {/* Account Details */}
      <div className="relative w-full flex flex-col">
        {/* Name & Username */}
        <div className="flex gap-1.5 items-center">
          <span className="text-xl font-bold">{user.name}</span>
          <span className="text-sm text-muted-foreground">
            @{user.username}
          </span>
          <span className="block md:hidden text-sm text-muted-foreground">
            - {getUserRole(user).name} Account
          </span>
        </div>

        {/* Email & Creation Date */}
        <div className="flex flex-col text-sm text-muted-foreground">
          <span>{user.email}</span>

          {/* Creation Date & Role */}
          <div className="md:absolute md:right-0 md:bottom-0 flex flex-col md:items-end">
            <span className="hidden md:block">
              {getUserRole(user).name} Account
            </span>
            <span>{createdAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DangerZone() {
  return (
    <div className="flex flex-col gap-2 select-none">
      {/* Header */}
      <h1 className="text-base xs:text-lg font-bold transition-all transform-gpu">
        Danger Zone
      </h1>

      <div className="flex gap-2 items-center">
        {/* Delete Account */}
        <ConfirmationPopover
          message="Are you sure you would like to delete your account? This action is irreversible and all of your data will be lost."
          confirmationButton="Delete Account"
          doubleConfirmation
          onConfirm={() => {}}
        >
          <Button variant="destructive" size="xs">
            Delete Account
          </Button>
        </ConfirmationPopover>

        {/* Delete All Files */}
        <ConfirmationPopover
          message="Are you sure you would like to delete all of your files? This action is irreversible and all of your files will be lost."
          confirmationButton="Delete All Files"
          doubleConfirmation
          onConfirm={() => {}}
        >
          <Button variant="destructive" size="xs">
            Delete All Files
          </Button>
        </ConfirmationPopover>
      </div>
    </div>
  );
}
