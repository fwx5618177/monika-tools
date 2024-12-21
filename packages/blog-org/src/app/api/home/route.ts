import { NextRequest, NextResponse } from "next/server";
import {
  imageData,
  recentArticles,
  tags,
  websiteStats,
  profileInfo,
} from "@/mocks/ssg";
import { HomeResponse } from "Response";
import { LocalPostActions } from "@/controllers/post/LocalPostActions";

export async function GET(
  _request: NextRequest
): Promise<NextResponse<HomeResponse>> {
  const localDataList = LocalPostActions.getAllPostsData();
  try {
    return new NextResponse(
      JSON.stringify({
        status: "success",
        code: "200",
        data: {
          imageData,
          list: localDataList,
          recentArticles,
          tags,
          websiteStats,
          profileInfo,
        },
      })
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        status: "error",
        code: "999",
        data: {
          imageData,
          list: localDataList,
          recentArticles,
          tags,
          websiteStats,
          profileInfo,
        },
      })
    );
  }
}
