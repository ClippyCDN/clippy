import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FileType } from "@/lib/db/schemas/file";
import { getFileName } from "@/lib/utils/file";
import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { formatBytes } from "@/lib/utils/utils";
import { format } from "date-fns";
import { ReactNode } from "react";

type FileInfoDialogProps = {
  fileMeta: FileType;
  children: ReactNode;
};

export default function FileInfoDialog({
  fileMeta,
  children,
}: FileInfoDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File Information</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col">
          {/* File Name */}
          <span>
            <span className="font-semibold">Name:</span> {getFileName(fileMeta)}
          </span>

          {/* Original File Name */}
          <span>
            <span className="font-semibold">Original Name:</span>{" "}
            {fileMeta.originalName ?? "Unknown"}
          </span>

          {/* File Size */}
          <span>
            <span className="font-semibold">Size:</span>{" "}
            {formatBytes(fileMeta.size)}
          </span>

          {/* Mime Type */}
          <span>
            <span className="font-semibold">Mimetype:</span> {fileMeta.mimeType}
          </span>

          {/* Views */}
          <span>
            <span className="font-semibold">Views:</span>{" "}
            {formatNumberWithCommas(fileMeta.views)}
          </span>

          {/* Upload Date */}
          <span>
            <span className="font-semibold">Uploaded Date:</span>{" "}
            {format(fileMeta.createdAt, "dd/MM/yyyy - HH:mm a")}
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
