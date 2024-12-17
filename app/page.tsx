import Image from "next/image";
import Title from "./components/Title";
import Checkbox from "./components/Checkbox";
import Graph from "./components/Graph";

export default function Home() {
  return (
    <div className="px-2">
      <Title />
      <Checkbox />
      <Graph />
    </div>
  );
}
