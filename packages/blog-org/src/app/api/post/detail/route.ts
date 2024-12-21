import { LocalPostActions } from "@/controllers/post/LocalPostActions";
import { DetailArticleDisplayResponse } from "Response";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (
  request: NextRequest
): Promise<NextResponse<DetailArticleDisplayResponse>> => {
  try {
    const { slug } = await request.json();
    const localDataList = LocalPostActions.getAllPostsData();
    const findItem: DetailArticleDisplayResponse = localDataList.find(
      (item) => item?.slug === String(slug)
    );

    const pre = {
      title: localDataList[0]?.title,
      updatedDate: localDataList[0]?.updatedDate || Date.now(),
      imageUrl: localDataList[0]?.imageUrl || "https://picsum.photos/950/150",
      type: "pre",
      slug: localDataList[0]?.slug,
    };
    const next = {
      title: localDataList[1]?.title || "没有了",
      updatedDate: localDataList[1]?.updatedDate || Date.now(),
      imageUrl: localDataList[1]?.imageUrl || "https://picsum.photos/950/150",
      type: "next",
      slug: localDataList[1]?.slug,
    };

    const result: DetailArticleDisplayResponse["relatives"] = [pre, next];

    return new NextResponse(
      JSON.stringify({
        status: "success",
        code: "200",
        data: {
          ...findItem,
          relatives: result,
        },
      })
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        status: "error",
        code: "999",
        data: null,
      })
    );
  }
};
