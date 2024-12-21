"use client";

import React, { useRef } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

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

type GraphProps = {
  selectedPrefectures: { [key: number]: PopulationResponse | null };
  prefectures: Prefecture[];
};

export default function Graph({
  selectedPrefectures,
  prefectures,
}: GraphProps) {
  const options: Highcharts.Options = {
    title: {
      text: "My chart",
    },
    series: [
      {
        type: "line",
        data: [1, 2, 3],
      },
    ],
  };

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);

  return (
    <div>
      <div>グラフ</div>
      <HighchartsReact
        highcharts={Highcharts}
        options={options}
        ref={chartComponentRef}
      />
    </div>
  );
}
