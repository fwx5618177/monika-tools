import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  try {
    const authToken = request.headers.get("Authorization");

    if (!authToken) {
      return NextResponse.json(
        {
          status: "error",
          code: "401",
          data: null,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const token = authToken?.replace("Bearer ", "");
    const isValidToken = await Promise.resolve(token === "123456");

    if (!isValidToken) {
      return new NextResponse(
        JSON.stringify({
          status: "error",
          code: "401",
          data: null,
          message: "Unauthorized",
        })
      );
    }

    return new NextResponse(
      JSON.stringify({
        status: "success",
        code: "200",
        data: null,
      })
    );
  } catch (error) {
    console.error(error);
    return new NextResponse(
      JSON.stringify({
        status: "error",
        code: "999",
        data: null,
        message: error?.message,
      })
    );
  }
};
