"use client";

import React, { useRef, useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Label from "./Label";

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
  const [population, setPopulation] = useState<
    { year: number; value: number; rate: number }[]
  >([]);
  const [selectedLabel, setSelectedLabel] = useState<string>("総人口");

  const labelOptions = [
    {
      value: "総人口",
      label: "総人口",
    },
    {
      value: "年少人口",
      label: "年少人口",
    },
    {
      value: "生産年齢人口",
      label: "生産年齢人口",
    },
    {
      value: "老年人口",
      label: "老年人口",
    },
  ];

  const labelcheck = (value: string) => {
    setSelectedLabel(value);
  };

  useEffect(() => {
    const totalPopulationData = Object.values(selectedPrefectures)
      .filter((data) => data !== null)
      .flatMap((population) =>
        population!.data
          .filter((category) => category.label === selectedLabel)
          .flatMap((category) => category.data)
      );
    setPopulation(totalPopulationData);
  }, [selectedPrefectures, selectedLabel]);

  const options: Highcharts.Options = {
    accessibility: {
      enabled: false,
    },
    chart: {
      backgroundColor: "#2b2b2b",
    },
    title: {
      text: `${selectedLabel}`,
      style: {
        color: "#ffffff",
      },
    },
    xAxis: {
      title: {
        text: "年",
        style: {
          color: "#ffffff",
        },
      },
      categories: Array.from(
        new Set(
          Object.values(selectedPrefectures)
            .filter((data) => data !== null)
            .flatMap((population) =>
              population!.data
                .filter((category) => category.label === selectedLabel)
                .flatMap((category) => category.data.map((item) => item.year))
            )
        )
      ).map((year) => year.toString()),
      labels: {
        style: {
          color: "#ffffff",
        },
      },
    },
    yAxis: {
      title: {
        text: "人口数",
        style: {
          color: "#ffffff",
        },
      },
      labels: {
        formatter: function () {
          return (this.value as number) / 10000 + "万人";
        },
        style: {
          color: "#ffffff",
        },
      },
    },
    legend: {
      itemStyle: {
        color: "#ffffff",
      },
    },
    series: Object.entries(selectedPrefectures)
      .filter(([data]) => data !== null)
      .flatMap(([prefCode, population]) => {
        const data = population!.data
          .filter((category) => category.label === selectedLabel)
          .flatMap((category) => category.data.map((item) => item.value));
        const prefName =
          prefectures.find((pref) => pref.prefCode === Number(prefCode))
            ?.prefName || `都道府県 ${prefCode}`;
        return {
          type: "line",
          name: prefName,
          data,
        };
      }),
  };

  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  return (
    <div className="mx-0">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold">グラフ</h1>
        <div className="flex-grow h-0.5 bg-gray-500"></div>
      </div>
      <div className="flex justify-end gap-2 sm:gap-5 mb-1 text-base sm:text-lg">
        {labelOptions.map((options) => (
          <Label
            key={options.value}
            value={options.value}
            label={options.label}
            selected={selectedLabel === options.value}
            onChange={labelcheck}
          />
        ))}
      </div>
      {population.length > 0 ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartComponentRef}
        />
      ) : (
        <p className="text-center font-bold text-red-500">
          都道府県を選択してください
        </p>
      )}
    </div>
  );
}
