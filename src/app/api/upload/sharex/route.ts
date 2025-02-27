import { FileType } from "@/lib/db/schemas/file";
import { env } from "@/lib/env";
import { uploadFile } from "@/lib/helpers/file";
import { getUserByUploadToken } from "@/lib/helpers/user";
import { validateMimeType } from "@/lib/mime";
import { getFileName } from "@/lib/utils/file";
import { randomString } from "@/lib/utils/utils";
import { ApiErrorResponse } from "@/type/api/responses";
import { NextResponse } from "next/server";

interface FileData {
  name: string;
  type: string;
  size: number;
  content: Uint8Array;
}

interface SuccessResponse {
  /**
   * The path to the uploaded file.
   */
  path: string;

  /**
   * The url of this Clippy instance.
   */
  url: string;

  /**
   * The url to delete the file.
   */
  deletionUrl: string;

  /**
   * The url to the thumbmail.
   */
  thumbnailUrl?: string;
}

/**
 * Processes a single file upload and returns structured file data
 */
async function processFile(file: File): Promise<FileData> {
  return {
    name: file.name,
    type: file.type,
    size: file.size,
    // @ts-ignore
    content: await file.bytes(),
  };
}

/**
 * Handles file uploads from ShareX
 * @param request The incoming request containing form data
 */
export async function POST(
  request: Request
): Promise<NextResponse<SuccessResponse | ApiErrorResponse>> {
  try {
    const formData = await request.formData();
    const uploadToken: string | undefined = formData.get("token")?.toString();
    if (!uploadToken) {
      return NextResponse.json(
        { message: "No upload token was provided" },
        { status: 401 }
      );
    }
    const user = await getUserByUploadToken(uploadToken);
    if (!user) {
      return NextResponse.json(
        { message: "Invalid upload token" },
        { status: 401 }
      );
    }

    const files = formData.getAll("sharex");

    // Validate if files exist
    if (!files.length) {
      return NextResponse.json(
        { message: "No files were uploaded" },
        { status: 400 }
      );
    }

    // Validate file types
    if (!files.every((file) => file instanceof File)) {
      return NextResponse.json(
        { message: "Invalid file format" },
        { status: 400 }
      );
    }

    let fileMeta: FileType;
    try {
      const file = await processFile(files[0]);
      if (!validateMimeType(file.type)) {
        return NextResponse.json(
          { message: `The mime-type "${file.type}" is not allowed` },
          { status: 400 }
        );
      }
      fileMeta = await uploadFile(
        randomString(8),
        file.name,
        file.size,
        Buffer.from(file.content),
        file.type,
        user
      );
    } catch (err) {
      return NextResponse.json(
        {
          message: (err as Error).message,
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      path: getFileName(fileMeta),
      url: env.NEXT_PUBLIC_WEBSITE_URL,
      deletionUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/api/user/file/delete/${fileMeta.deleteKey}`,
      ...(fileMeta.thumbnailId
        ? {
            thumbnailUrl: `${env.NEXT_PUBLIC_WEBSITE_URL}/thumbnails/${fileMeta.thumbnailId}.${fileMeta.thumbnailExtension}`,
          }
        : {}),
    });
  } catch (error) {
    console.error("Error processing file upload:", error);

    return NextResponse.json(
      {
        message:
          "Failed to upload your file, please contact an admin if this keeps occuring",
      },
      { status: 500 }
    );
  }
}

// Configuration for the API route
export const config = {
  api: {
    bodyParser: false,
  },
};
