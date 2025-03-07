import { handleApiRequestWithUser } from "@/lib/api-commons";
import { getUserFiles, getUserFilesCount } from "@/lib/helpers/user";
import { Pagination } from "@/lib/pagination";
import { UserFilesSort } from "@/type/user/user-file-sort";
import { NextRequest, NextResponse } from "next/server";

const ITEMS_PER_PAGE = 15;

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ page: string }>;
  }
): Promise<NextResponse | Response> {
  return handleApiRequestWithUser(async (user) => {
    const { page } = await params;

    const searchParams = request.nextUrl.searchParams;
    const sort = {
      key: searchParams.get("sortKey") ?? "createdAt",
      direction: searchParams.get("sortDirection") ?? "desc",
    } as UserFilesSort;

    // todo: validate the sort query

    const totalFiles = await getUserFilesCount(user.id);
    const pagination = new Pagination();
    pagination.setItemsPerPage(ITEMS_PER_PAGE);
    pagination.setTotalItems(totalFiles);

    const paginatedPage = await pagination.getPage(
      Number(page),
      async (fetchItems) => {
        const files = await getUserFiles(user.id, {
          limit: ITEMS_PER_PAGE,
          offset: fetchItems.start,
          sort: sort,
        });

        return files;
      }
    );

    return NextResponse.json(paginatedPage, { status: 200 });
  });
}
