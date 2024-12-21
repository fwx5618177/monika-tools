import CharacterNetwork from "@/components/CharacterNetwork";
import SigmaComponent from "@/components/CharacterNetwork/SigmaComponent";
import CloudAnime from "@/components/CloudAnime";
import { Typography } from "antd";

const CharacterDesign = () => {
  return (
    <div>
      <Typography.Title>人物设计</Typography.Title>
      <div>
        <CharacterNetwork />

        <SigmaComponent />
        <CloudAnime />
      </div>
    </div>
  );
};

export default CharacterDesign;
