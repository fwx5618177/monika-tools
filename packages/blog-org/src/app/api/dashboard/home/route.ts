import { NextResponse } from "next/server";
import { DashBoardDetailModifyProps } from "Response";
import LocalMarkdownService from "@/controllers/dashboard/LocalMarkdownService";
import path from "path";
import { LocalPostActions } from "@/controllers/post/LocalPostActions";
import { PostStatusProps } from "Dashboard";

export const GET = async () => {
  try {
    const postList = LocalPostActions.getAllPostsData();

    return NextResponse.json({
      status: "success",
      code: "200",
      data: postList,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      status: "error",
      code: "999",
      data: [],
    });
  }
};

export async function PUT(request: Request) {
  try {
    const data: DashBoardDetailModifyProps = await request.json();

    // TODO: 调用远端的接口，然后上传当前的数据给远端的接口
    // if (data.status !== PostStatusEnum.UPLOAD) {
    //   return NextResponse.json(
    //     {
    //       status: "success",
    //       code: "200",
    //       data: null,
    //       message: "修改成功",
    //     },
    //     {
    //       status: 200,
    //     }
    //   );
    // }

    // 解析、修改本地文件
    const baseDirectory = path.join(process.cwd(), "posts");
    // 使用 LocalMarkdownService 更新Markdown文件
    const localMarkdownService =
      LocalMarkdownService.getInstance(baseDirectory);
    const result = await localMarkdownService.updateMarkdown(data);

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
    console.error(error);

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
}

export const PATCH = async (request: Request) => {
  try {
    const body: PostStatusProps = await request.json();
    const { id, title, slug } = body;

    // 解析、修改本地文件
    const baseDirectory = path.join(process.cwd(), "posts");
    // 使用 LocalMarkdownService 更新Markdown文件
    const localMarkdownService =
      LocalMarkdownService.getInstance(baseDirectory);

    const result = await localMarkdownService.insertLocalMarkDownID({
      id,
      title,
      slug,
    });

    return NextResponse.json(
      {
        status: "success",
        code: "200",
        data: {
          isExist: true,
          result,
        },
        message: "查询成功",
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
        data: {
          isExist: false,
          result: {
            message: error?.message,
            successIds: [],
            failedIds: [],
          },
        },
        message: error?.message,
      },
      {
        status: 500,
      }
    );
  }
};
