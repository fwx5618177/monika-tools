import LocalMarkdownService from "@/controllers/dashboard/LocalMarkdownService";
import { PostStatusProps } from "Dashboard";
import { NextResponse } from "next/server";
import path from "path";

export const POST = async (request: Request) => {
  const baseDirectory = path.join(process.cwd(), "posts");
  try {
    const body: PostStatusProps[] = await request.json();
    const localMarkdownService =
      LocalMarkdownService.getInstance(baseDirectory);

    const result = await localMarkdownService.insertLocalMarkDownIDs(body);

    return NextResponse.json(
      {
        status: "success",
        code: "200",
        data: result,
        message: "修改成功",
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        code: "999",
        data: null,
        message: error?.message,
      },
      {
        status: 500,
      }
    );
  }
};
