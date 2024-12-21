import { CalendarHeatMapProps } from "Components";
import { FC } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import moment from "moment";
import { Card } from "antd";

import styles from "./index.module.scss";
import "react-calendar-heatmap/dist/styles.css";

const monthLabels = [
  "一月",
  "二月",
  "三月",
  "四月",
  "五月",
  "六月",
  "七月",
  "八月",
  "九月",
  "十月",
  "十一月",
  "十二月",
];

const weekdayLabels = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const CalendarHeatMapCard: FC<Partial<CalendarHeatMapProps>> = ({
  startDate = moment().startOf("year").toDate(),
  endDate = moment().endOf("year").toDate(),
  values = [],
  pushCount = 0,
  pushDate,
}) => {
  const handleClassForValue = (value) => {
    if (!value) {
      return styles["color-empty"];
    }

    const count = value.count;
    if (count <= 1) {
      return styles["color-scale-1"];
    } else if (count <= 4) {
      return styles["color-scale-2"];
    } else if (count <= 6) {
      return styles["color-scale-3"];
    } else {
      return styles["color-scale-4"];
    }
  };

  return (
    <Card
      style={{
        width: "100%",
        boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
        borderRadius: 10,
        padding: 6,
        marginTop: 16,
      }}
      bodyStyle={{ overflow: "auto" }}
    >
      <CalendarHeatmap
        startDate={startDate}
        endDate={endDate}
        showWeekdayLabels
        showMonthLabels
        showOutOfRangeDays
        horizontal
        monthLabels={monthLabels}
        weekdayLabels={weekdayLabels}
        classForValue={handleClassForValue}
        gutterSize={2}
        values={values}
      ></CalendarHeatmap>

      <div>
        今日推送次数: {pushCount} ({pushDate})
      </div>
    </Card>
  );
};

export default CalendarHeatMapCard;
