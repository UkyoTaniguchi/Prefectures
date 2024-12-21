"use client";

import Title from "./components/Title";
import Checkbox from "./components/Checkbox";
import Graph from "./components/Graph";
import { useState } from "react";

type Prefecture = {
  prefCode: number;
  prefName: string;
};

type PopulationResponse = {
  boundaryYear: number;
  data: {
    label: string;
    data: {
      year: number;
      value: number;
      rate: number;
    }[];
  }[];
};

export default function Home() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<{
    [key: number]: PopulationResponse | null;
  }>({});
  return (
    <div className="px-2">
      <Title />
      <Checkbox
        selectedPrefectures={selectedPrefectures}
        setSelectedPrefectures={setSelectedPrefectures}
        prefectures={prefectures}
        setPrefectures={setPrefectures}
      />
      <Graph
        selectedPrefectures={selectedPrefectures}
        prefectures={prefectures}
      />
    </div>
  );
}
