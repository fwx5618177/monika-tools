import { LoginResponse } from "Response";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const data: {
      username: string;
      password: string;
      rememberMe: boolean;
    } = await request.json();

    return NextResponse.json({
      code: "200",
      status: "success",
      data: {
        token: data?.password,
      },
      messages: null,
    });
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
