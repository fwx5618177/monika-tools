import { FC } from "react";
import type { Metadata } from "next";
import { getDefaultPostData } from "@/services/fetchInitialProps/post/getDefaultData";
import { getDefaultHomeData } from "@/services/fetchInitialProps/home/getDefaultData";
import PostView from "@/views/PostView";
import { notFound } from "next/navigation";
import { PostPageParmaProps } from "Components";

export const generateMetadata = async (props: {
  params: {
    slug: string;
  };
}): Promise<Metadata> => {
  const { params } = props;
  const { slug } = params || { slug: "" };
  const defaultPostData = await getDefaultPostData(slug);

  return {
    title: defaultPostData?.title || "",
    authors: defaultPostData?.author,
    description: defaultPostData?.description || "",
  };
};

const Page: FC<PostPageParmaProps> = async ({ params }) => {
  const { slug } = params || { slug: "" };

  if (!slug) notFound();

  const defaultData = await getDefaultHomeData();
  const defaultPostData = await getDefaultPostData(slug);

  return <PostView defaultData={defaultData} postData={defaultPostData} />;
};

export default Page;
