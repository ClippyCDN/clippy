"use client";

import DeleteFileDialog from "@/components/dashboard/user/files/delete-file-dialog";
import FileContextMenu from "@/components/dashboard/user/files/file-context-menu";
import FileExtensionIcon from "@/components/file-icon";
import FileVideoPlayer from "@/components/file/video-player";
import SimpleTooltip from "@/components/simple-tooltip";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Loader from "@/components/ui/loader";
import { FileType } from "@/lib/db/schemas/file";
import { env } from "@/lib/env";
import { getFileName } from "@/lib/utils/file";
import { formatNumberWithCommas } from "@/lib/utils/number-utils";
import { formatBytes } from "@/lib/utils/utils";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import { format, formatDistance } from "date-fns";
import { DownloadIcon, LinkIcon, PlayIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export type UserFileProps = {
  fileMeta: FileType;
  refetch: () => Promise<void>;
};

export default function UserFile({ fileMeta, refetch }: UserFileProps) {
  const url = `/${getFileName(fileMeta)}`;
  const hasThumbnail =
    fileMeta.mimeType.startsWith("video") ||
    fileMeta.mimeType.startsWith("image");

  const currentDate = new Date();
  const uploadedDate = new Date(fileMeta.createdAt);
  const difference = currentDate.getTime() - uploadedDate.getTime();

  const exactDate: string = format(fileMeta.createdAt, "dd/MM/yyyy - HH:mm a");
  const formattedDate =
    difference > 86400000 // 24 hours in milliseconds
      ? format(uploadedDate, "MM/dd/yyyy HH:mm a")
      : formatDistance(uploadedDate, currentDate) + " ago";

  function copyUrl() {
    navigator.clipboard.writeText(
      `${env.NEXT_PUBLIC_WEBSITE_URL}/${getFileName(fileMeta)}`
    );

    toast(`Copied the url for ${getFileName(fileMeta)} to your clipboard`);
  }

  return (
    <FileContextMenu fileMeta={fileMeta} refetch={refetch}>
      <div className="bg-card h-full flex flex-col items-center rounded-md">
        <div className="h-full p-2 flex flex-col gap-1">
          <div className="flex flex-col items-center select-none">
            {/* File Name */}
            <Link
              href={url}
              className="hover:opacity-80 cursor-pointer transition-all transform-gpu"
              target="_blank"
              prefetch={false}
            >
              {getFileName(fileMeta)}
            </Link>

            {/* Upload Date */}
            <SimpleTooltip content={`Uploaded on ${exactDate}`}>
              <span className="text-sm text-muted-foreground">
                {formattedDate}
              </span>
            </SimpleTooltip>
          </div>

          {/* Preview */}
          <div className="flex-1 flex items-center w-full justify-center">
            {hasThumbnail ? (
              <FilePreview fileMeta={fileMeta} />
            ) : (
              <div className="flex justify-center items-center">
                <div className="w-16">
                  <FileExtensionIcon extension={fileMeta.extension} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-2 items-center justify-between w-full px-1.5 bg-zinc-800/65 py-1 rounded-bl-md rounded-br-md">
          <div className="flex flex-col 2xl:flex-row 2xl:divide-x-2 2xl:divide-card">
            <span className="text-sm text-muted-foreground pr-2">
              {formatBytes(fileMeta.size)}
            </span>
            <span className="text-sm text-muted-foreground 2xl:pl-2">
              {formatNumberWithCommas(fileMeta.views)} View
              {fileMeta.views == 1 ? "" : "s"}
            </span>
          </div>

          {/* Buttons */}
          <div className="lg:hidden flex gap-2 items-center">
            <SimpleTooltip content="Copy URL">
              <button className="cursor-pointer" onClick={() => copyUrl()}>
                <LinkIcon className="size-4.5 hover:opacity-80 transition-all transform-gpu" />
              </button>
            </SimpleTooltip>

            {/* Download File */}
            <SimpleTooltip content="Download File">
              <Link href={url} prefetch={false} draggable={false}>
                <DownloadIcon className="size-4.5 hover:opacity-80 transition-all transform-gpu" />
              </Link>
            </SimpleTooltip>

            <FileInfo fileMeta={fileMeta} />

            {/* Delete File Button */}
            <DeleteFileDialog fileMeta={fileMeta} refetch={refetch}>
              <SimpleTooltip className="bg-destructive" content="Delete File">
                <TrashIcon className="size-4 text-red-400 hover:opacity-80 cursor-pointer transition-all transform-gpu" />
              </SimpleTooltip>
            </DeleteFileDialog>
          </div>
        </div>
      </div>
    </FileContextMenu>
  );
}

function FilePreview({ fileMeta }: { fileMeta: FileType }) {
  const url = `/${getFileName(fileMeta)}?incrementviews=false`;
  const isImage = fileMeta.mimeType.startsWith("image");
  const isVideo = fileMeta.mimeType.startsWith("video");

  const [loading, setLoading] = useState<boolean>(
    isVideo || isImage ? true : false
  );

  return (
    <Dialog>
      <DialogTrigger className="relative cursor-pointer w-full flex items-center justify-center">
        <img
          src={fileMeta.hasThumbnail ? `/thumbnails/${fileMeta.id}.webp` : url}
          alt="Recent File Image Preview"
          className="transparent max-h-36"
          onLoad={() => setLoading(false)}
          draggable={false}
        />
        {loading && (
          <div className="w-full flex justify-center">
            <Loader />
          </div>
        )}
        {fileMeta.mimeType.startsWith("video") && !loading && (
          <PlayIcon className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size-10" />
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center w-full sm:w-fit lg:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{getFileName(fileMeta)}</DialogTitle>
        </DialogHeader>
        {isImage && (
          <img
            src={url}
            alt={`Image for ${getFileName(fileMeta)}`}
            className="max-h-[70vh]"
            draggable={false}
          />
        )}

        {isVideo && <FileVideoPlayer url={url} className="max-h-[70vh]" />}
      </DialogContent>
    </Dialog>
  );
}

function FileInfo({ fileMeta }: { fileMeta: FileType }) {
  return (
    <Dialog>
      <DialogTrigger>
        <SimpleTooltip content="File Info">
          <InformationCircleIcon className="size-4.5 cursor-pointer hover:opacity-80 transition-all transform-gpu" />
        </SimpleTooltip>
      </DialogTrigger>
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
