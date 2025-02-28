import { authError } from "@/lib/api-commons";
import { auth } from "@/lib/auth";
import { getUserFiles } from "@/lib/helpers/user";
import { ApiErrorResponse } from "@/type/api/responses";
import { UserStatisticsResponse } from "@/type/api/user/statistics-response";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(
  request: Request
): Promise<NextResponse<UserStatisticsResponse | ApiErrorResponse>> {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });
  if (!session) {
    return authError;
  }

  const images = await getUserFiles(session.user.id);
  const statistics: UserStatisticsResponse = {
    totalUploads: 0,
    uploadsToday: 0,
    storageUsed: 0,
    filesStorageUsed: 0,
    thumbnailStorageUsed: 0,
    totalViews: 0,
  };

  for (const image of images) {
    statistics.totalUploads++;

    // Checks if the image was made less than 24 hours ago
    const timeDifference =
      new Date().getTime() - new Date(image.createdAt).getTime();
    if (timeDifference < 24 * 60 * 60 * 1000) {
      statistics.uploadsToday++;
    }

    statistics.storageUsed += image.size;
    statistics.filesStorageUsed += image.size;
    statistics.totalViews += image.views;

    if (image.thumbnailSize) {
      statistics.thumbnailStorageUsed += image.thumbnailSize;
      statistics.storageUsed += image.thumbnailSize;
    }
  }

  return NextResponse.json(statistics, { status: 200 });
}
