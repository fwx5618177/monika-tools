import { config } from "@/config/dev";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import { template } from "./template";

export const sendEmail = async (
  recipientEmail: any,
  subject = "Welcome to subscribe Hyou Blog",
  content = "Thanks for subscribing to Hyou Blog!"
): Promise<SMTPTransport.SentMessageInfo> => {
  try {
    // 创建一个SMTP客户端配置
    let transporter = nodemailer.createTransport({
      service: "126",
      host: "smtp.126.com",
      port: 25,
      secure: false,
      auth: {
        user: config.email_user,
        pass: config.email_pwd,
      },
    });

    // 设置邮件内容
    let mailOptions = {
      from: `"Hyou Blog" <${config.email_from}>`, // 发送者显示名称和邮箱
      to: recipientEmail, // 接收者的邮箱
      subject: subject, // 邮件主题
      text: content, // 纯文本内容
      html: template({
        content,
        user: recipientEmail,
      }), // HTML内容
    };

    // 使用Promise.race实现超时机制，设置超时时间为10秒
    const sendPromise: Promise<SMTPTransport.SentMessageInfo> =
      transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error("Email send timed out, need to push MQ and re-send.")
          ),
        15000
      )
    );

    // 等待邮件发送或超时
    const info: SMTPTransport.SentMessageInfo | any = await Promise.race([
      sendPromise,
      timeoutPromise,
    ]);

    return info;
  } catch (error) {
    console.error("Error sending email: ", error);

    if (error.code === "EAUTH") {
      console.error("Authentication failed:", error.message);
    }

    throw error;
  }
};
