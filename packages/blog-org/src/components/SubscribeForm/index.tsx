import React from "react";
import styles from "./index.module.scss";
import SubscribeForm from "./SubscribeButtons";
import { FaRss } from "react-icons/fa";
import { useMutation } from "react-query";
import { message } from "antd";
import { SubscribeEmailApi } from "@/services/SubscribeForm/SubscribeServiceApi";
import { useSubscribeEmail } from "@/services/SubscribeForm/hooks";

const SubscribeButtons = () => {
  const { mutate: subscribe } = useSubscribeEmail<
    string,
    {
      recipientEmail: string;
    }
  >();

  const { mutate: subscribeRss } = useMutation(
    SubscribeEmailApi.subscribeRss<any>,
    {
      onSuccess: (data) => {
        message.success("Subscribed RSS successfully.");
        parseRssFeed(data);
      },
      onError: () => {
        message.error("Failed to subscribe.");
      },
    }
  );

  const parseRssFeed = (xml: string) => {
    // 使用 DOMParser 解析 XML 字符串
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, "text/xml");

    // 提取 channel 和 item 元素
    const channel = xmlDoc.querySelector("channel");
    const items = channel.querySelectorAll("item");

    // 将每个 item 转换为一个 JavaScript 对象
    const feedItems = Array.from(items).map((item) => {
      return {
        title: item.querySelector("title")?.textContent || "",
        link: item.querySelector("link")?.textContent || "",
        description: item.querySelector("description")?.textContent || "",
        pubDate: item.querySelector("pubDate")?.textContent
          ? new Date(item.querySelector("pubDate").textContent)
          : new Date(),
      };
    });

    console.log({ feedItems });

    return feedItems;
  };

  const onEmailSubscribe = (email: string) => {
    subscribe({
      recipientEmail: email,
    });

    message.success("Subscribed successfully.");
  };

  return (
    <div className={styles.buttonsContainer}>
      {/* <div onClick={() => subscribeRss()} className={styles.rssButton}>
        <FaRss />
        RSS
      </div> */}

      <SubscribeForm onSubscribe={onEmailSubscribe} />
    </div>
  );
};

export default React.memo(SubscribeButtons);
