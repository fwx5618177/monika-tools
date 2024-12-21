import { LocalPostActions } from "@/controllers/post/LocalPostActions";
import { Feed } from "feed";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    const posts = LocalPostActions.getAllPostsData();

    const feed = new Feed({
      title: "Moxi RSS Feed",
      description: "This is my personal feed!",
      id: "https://moxixii.com/",
      link: "https://moxixii.com/",
      language: "en",
      feedLinks: {
        rss2: "https://moxixii.com/rss.xml",
      },
      author: {
        name: "moxixii",
        email: "fengwenxuan2006@126.com",
        link: "https://moxixii.com",
      },
      copyright: "Moxi",
    });

    posts.forEach((post) => {
      feed.addItem({
        title: post.title,
        id: post.id,
        link: `https://moxixii.com/posts/${post.slug}`,
        description: post.description,
        content: post.content,
        date: new Date(post.createdDate),
      });
    });

    return new NextResponse(
      JSON.stringify({
        status: "success",
        code: 200,
        data: feed.rss2(),
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/rss+xml",
        },
      }
    );
  } catch (error) {
    console.error("Error sending rss: ", error);
    return new NextResponse(
      JSON.stringify({
        status: "error",
        code: 500,
        message: "Error sending rss",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
