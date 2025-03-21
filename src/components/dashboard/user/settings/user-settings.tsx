import AvatarInitials from "@/components/avatar-initials";
import ConfirmationPopover from "@/components/confirmation-popover";
import BooleanPreference from "@/components/dashboard/user/settings/types/boolean-preference";
import Preference, {
  PreferenceCategory,
} from "@/components/dashboard/user/settings/types/preference";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ActivityGraph from "@/components/user/activity-graph";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { env } from "@/lib/env";
import { getUserRole } from "@/lib/helpers/role";
import { DATE_FORMATS, formatDate } from "@/lib/utils/date";
import { FolderDown, FolderX, Trash2 } from "lucide-react";

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
      <DataAndPrivacy />
      <Separator />
      <DangerZone />
    </div>
  );
}

function UserDetails({ user }: { user: any }) {
  const createdAt = `Created on ${formatDate(user.createdAt, DATE_FORMATS.FULL_DATE)}`;
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

function DataAndPrivacy() {
  return (
    <PreferenceCategory name="Data & Privacy">
      {/* Public Activity */}
      <BooleanPreference
        preferenceId="showKitty"
        header="Public Activity"
        description="Would you like to display your activity graph on your public profile?"
      />

      {/* Download Data */}
      <Preference
        header="Request my data"
        description={`Would you like to request a copy of your data that ${env.NEXT_PUBLIC_WEBSITE_NAME} has?`}
      >
        <Button variant="secondary" size="xs">
          <FolderDown />
          Request Data
        </Button>
      </Preference>
    </PreferenceCategory>
  );
}

function DangerZone() {
  return (
    <PreferenceCategory name="Danger Zone">
      {/* Data Deletion */}
      <Preference
        header="Data Deletion"
        description={`Here is where you can delete your account, or delete all of your files from ${env.NEXT_PUBLIC_WEBSITE_NAME}.`}
      >
        {/* Delete All Files */}
        <ConfirmationPopover
          message="Are you sure you would like to delete all of your files? This action is irreversible and all of your files will be lost."
          confirmationButton="Delete All Files"
          doubleConfirmation
          onConfirm={() => {}}
        >
          <Button variant="destructive" size="xs">
            <FolderX />
            Delete Files
          </Button>
        </ConfirmationPopover>

        {/* Delete Account */}
        <ConfirmationPopover
          message="Are you sure you would like to delete your account? This action is irreversible and all of your data will be lost."
          confirmationButton="Delete Account"
          doubleConfirmation
          onConfirm={() => {}}
        >
          <Button className="text-destructive" variant="secondary" size="xs">
            <Trash2 />
            Delete Account
          </Button>
        </ConfirmationPopover>
      </Preference>
    </PreferenceCategory>
  );
}
