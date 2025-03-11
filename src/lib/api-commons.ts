import { NextResponse } from "next/server";
import ApiError from "./api-errors/api-error";
import { UserType } from "./db/schemas/auth-schema";
import { getApiUser } from "./helpers/user";
import { formatBytes } from "./utils/utils";

export const authError = new ApiError("Invalid Credentials", 401);
export const notFound = new ApiError("Not Found", 404);
export function fileExceedsUploadLimit(uploadLimit: number) {
  return new ApiError(
    `File exceeds your upload limit of ${formatBytes(uploadLimit)}`,
    413
  );
}

/**
 * Handles an api request with a user.
 *
 * @param request the request
 * @param handler the handler
 * @returns the response
 */
export async function handleApiRequestWithUser(
  handler: (user: UserType) => Promise<NextResponse>
) {
  try {
    const user = await getApiUser();
    return await handler(user);
  } catch (error) {
    if (error instanceof NextResponse) {
      return error;
    }
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * Handles an api request.
 *
 * @param request the request
 * @param handler the handler
 * @returns the response
 */
export async function handleApiRequest(handler: () => Promise<NextResponse>) {
  try {
    return await handler();
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.status }
      );
    }
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
