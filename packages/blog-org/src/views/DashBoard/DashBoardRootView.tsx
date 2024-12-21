"use client";

import ArticleInfoCard from "@/components/ArticleInfoCard";
import CalendarHeatMap from "@/components/CalendarHeatMapCard";
import { useLocalPostList } from "@/services/Local/hooks";
import { useMemo } from "react";
import { find } from "lodash";
import moment from "moment";
import { HeatMapDataProps } from "Components";

const DashBoardRootView = () => {
  const { data } = useLocalPostList();
  const {
    latestLastPublished,
    uniqueTypes,
    totalCount,
    heatMapData,
    minDate,
    maxDate,
  } = useMemo(() => {
    const typesSet: Set<string> = new Set();
    let latestDate = { date: new Date(0), name: "", slug: "" };
    const heatMapData: HeatMapDataProps[] = [];
    let found = false;
    let minDate: any = Date.now();
    let maxDate: any = Date.now();

    data?.forEach((item) => {
      const date = item?.updatedDate;
      minDate = moment(minDate).isBefore(date) ? minDate : date;
      maxDate = moment(maxDate).isAfter(date) ? maxDate : date;

      for (let cItem of heatMapData) {
        const isSameDay = moment(date).isSame(cItem.date, "day");

        if (isSameDay) {
          cItem.count++;
          found = true;
        }
      }

      if (!found) {
        heatMapData.push({
          date: moment(date).format("YYYY-MM-DD HH:mm:ss"),
          count: 1,
        });
      }

      found = false;

      // 更新去重后的type集合
      if (item?.type) {
        typesSet.add(item.type);
      }

      // 查找最新的lastPublished日期
      const itemDate = new Date(item?.updatedDate);
      if (itemDate > latestDate?.date) {
        latestDate = {
          date: itemDate,
          name: item?.title,
          slug: item?.slug,
        };
      }
    });

    return {
      latestLastPublished: latestDate,
      uniqueTypes: Array.from(typesSet),
      totalCount: data?.length || 0,
      heatMapData,
      minDate,
      maxDate,
    };
  }, [data]);

  const todayPushCount = useMemo(() => {
    const today = moment().format("YYYY-MM-DD HH:mm:ss");
    const todayData = heatMapData.find((item) =>
      moment(item.date).isSame(today, "day")
    );

    return {
      count: todayData?.count || 0,
      date: moment(todayData?.date).format("YYYY-MM-DD HH:mm:ss"),
    };
  }, [heatMapData]);

  return (
    <div>
      <ArticleInfoCard
        title="文章"
        articleCount={totalCount}
        lastPublished={latestLastPublished}
        typeCount={uniqueTypes}
      />

      <CalendarHeatMap
        startDate={moment(minDate).startOf("year").toDate()}
        endDate={moment(maxDate).endOf("year").toDate()}
        values={heatMapData}
        pushCount={todayPushCount.count}
        pushDate={todayPushCount.date}
      />
    </div>
  );
};

export default DashBoardRootView;
