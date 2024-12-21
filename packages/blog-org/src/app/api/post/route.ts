import { LocalPostActions } from "@/controllers/post/LocalPostActions";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    return new NextResponse(
      JSON.stringify({
        status: "success",
        code: "200",
        data: LocalPostActions.getAllPostsData(),
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
