import AnimatedRightChevron from "@/components/animated-right-chevron";
import PasswordInput from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TwoFactorInput } from "@/components/user/two-factor-input";
import { authClient } from "@/lib/client-auth";
import { UserType } from "@/lib/db/schemas/auth-schema";
import { capitalize, copyWithToast } from "@/lib/utils/utils";
import { Check, Copy, Loader2, QrCode, Shield } from "lucide-react";
import { usePathname } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { FormEvent, ReactNode, useState } from "react";
import { toast } from "sonner";

type TwoFactorDialogProps = {
  user: UserType;
  mode: "enable" | "disable";
  children: ReactNode;
};

type TwoFactorEnableData = { totpURI: string; backupCodes: string[] };

export default function TwoFactorDialog({
  user,
  mode,
  children,
}: TwoFactorDialogProps) {
  const path: string = usePathname();
  const [state, setState] = useState<"password-prompt" | "verify">(
    "password-prompt"
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationData, setVerificationData] =
    useState<TwoFactorEnableData | null>(null);

  async function handlePassword(password: string) {
    const { data, error } = await authClient.twoFactor[mode]({
      password: password as string,
    });

    // Handle errors
    if (error) {
      let errorMessage: string = error.statusText ?? null;
      if (error.status === 400) {
        errorMessage = "Hmm that didn't work, is your password wrong?";
      }
      if (errorMessage) {
        setError(errorMessage);
        toast.error(errorMessage);
      }
      return;
    }
    // Success, continue
    setError(null);
    if (mode === "enable") {
      setState("verify");
      setVerificationData(data as TwoFactorEnableData);
    } else {
      window.location.href = path;
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        {/* Header */}
        <DialogHeader>
          <DialogTitle>
            {state === "password-prompt" ? (
              <>
                <Shield /> {capitalize(mode)} Two Factor Authentication
              </>
            ) : (
              <>
                <QrCode /> Two Factor Verification
              </>
            )}
          </DialogTitle>
          {mode === "enable" && (
            <DialogDescription>
              Enabling two-factor authentication adds an extra layer of security
              to your account.{" "}
              {state === "password-prompt"
                ? "To begin, enter your password below."
                : "To complete the process, scan the QR code below with your authenticator app."}
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="flex flex-col gap-2">
          {/* Password Prompt */}
          {state === "password-prompt" && (
            <PasswordPrompt
              loading={loading}
              setLoading={setLoading}
              handleSubmit={handlePassword}
            />
          )}

          {/* Verification View */}
          {state === "verify" && (
            <VerificationView
              data={verificationData as TwoFactorEnableData}
              loading={loading}
              setLoading={setLoading}
              setError={setError}
            />
          )}

          {/* Error */}
          {error && <p className="mx-auto text-destructive">{error}</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PasswordPrompt({
  loading,
  setLoading,
  handleSubmit,
}: {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  handleSubmit: (password: string) => void;
}) {
  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    if (loading || !password) return;
    setLoading(true);
    handleSubmit(password as string);
    setLoading(false);
  };

  return (
    <form className="w-full flex items-center" onSubmit={handlePasswordSubmit}>
      <PasswordInput className="rounded-r-none" />
      <Button
        className="group rounded-l-none"
        type="submit"
        variant="secondary"
        disabled={loading}
      >
        {loading && <Loader2 className="size-4 animate-spin" />}
        Continue
        <AnimatedRightChevron size={5} />
      </Button>
    </form>
  );
}

function VerificationView({
  data,
  loading,
  setLoading,
  setError,
}: {
  data: TwoFactorEnableData;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}) {
  const path: string = usePathname();
  const secret = data.totpURI.split("secret=")[1].split("&")[0];

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const pin = formData.get("pin") as string;
    if (loading) return;
    if (!pin || pin.length !== 6) {
      setError("Please enter a valid 6-digit code.");
      return;
    }
    setLoading(true);

    // Attempt to verify the user's totp pin
    const { error } = await authClient.twoFactor.verifyTotp({
      code: pin as string,
    });
    if (error) {
      setError(error.statusText ?? null);
    } else {
      // Successfully verified, refresh
      window.location.href = path;
    }
    setLoading(false);
  }

  return (
    <form className="flex flex-col gap-4 items-center" onSubmit={handleVerify}>
      {/* QR Code */}
      <QRCodeSVG className="my-6" value={data.totpURI} />

      {/* Secret Key */}
      <code className="px-2 py-1 flex gap-2.5 items-center text-xs text-muted-foreground border border-muted rounded-md">
        {secret}
        <Button
          className="size-2"
          type="button"
          variant="ghost"
          size="icon"
          onClick={async () =>
            await copyWithToast(
              secret,
              "Copied the secret key to your clipboard!"
            )
          }
        >
          <Copy />
        </Button>
      </code>

      {/* Pin Input */}
      <div className="w-full flex flex-col gap-1 items-center">
        <label className="font-bold">Your Pin</label>
        <TwoFactorInput />
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code from your authenticator app.
        </p>
      </div>

      {/* Verify */}
      <Button
        className="w-24"
        type="submit"
        variant="secondary"
        disabled={loading}
      >
        {loading ? <Loader2 className="size-4 animate-spin" /> : <Check />}{" "}
        Verify
      </Button>
    </form>
  );
}
