import CharacterTimeLineShow from "@/components/CharacterTimeLineShow";
import { Typography } from "antd";

const CharacterTimeLine = () => {
  return (
    <div>
      <Typography.Title>人物时间线</Typography.Title>

      <div>
        <CharacterTimeLineShow />
      </div>
    </div>
  );
};

export default CharacterTimeLine;
