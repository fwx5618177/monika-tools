import { sendEmail } from "@/services/SubscribeForm/sendEmail";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 确保请求的方法为POST
    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({
          status: 999,
          message: "Method Not Allowed",
          data: null,
        }),
        {
          status: 405,
        }
      );
    }

    // 解析请求体中的数据
    const { recipientEmail } = await request.json();

    // 检查是否提供了所有必要的字段
    if (!recipientEmail) {
      return new Response(
        JSON.stringify({
          status: 999,
          message: "Missing required fields",
          data: null,
        }),
        {
          status: 400,
        }
      );
    }

    // 发送邮件
    const info = await sendEmail(recipientEmail);

    // 返回成功响应
    return new NextResponse(
      JSON.stringify({ code: 200, message: "success", data: info?.messageId }),
      {
        status: 200,
      }
    );
  } catch (error) {
    // 返回错误响应
    return new NextResponse(
      JSON.stringify({ code: 999, message: error.message, data: null }),
      {
        status: 200,
      }
    );
  }
}
