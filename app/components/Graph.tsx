"use client";

import React, { useRef, useState, useEffect } from "react";
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
  const [population, setPopulation] = useState<
    { year: number; value: number; rate: number }[]
  >([]);
  const [selectedLabel, setSelectedLabel] = useState<string>("総人口");

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
          return this.value.toLocaleString();
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
      .filter(([_, data]) => data !== null)
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
    <div>
      <div>
        <div>
          <input
            type="radio"
            name="population"
            value="総人口"
            onChange={(e) => labelcheck(e.target.value)}
            checked={selectedLabel === "総人口"}
          />
          総人口
        </div>
        <div>
          <input
            type="radio"
            name="population"
            value="年少人口"
            onChange={(e) => labelcheck(e.target.value)}
            checked={selectedLabel === "年少人口"}
          />
          年少人口
        </div>
        <div>
          <input
            type="radio"
            name="population"
            value="生産年齢人口"
            onChange={(e) => labelcheck(e.target.value)}
            checked={selectedLabel === "生産年齢人口"}
          />
          生産年齢人口
        </div>
        <div>
          <input
            type="radio"
            name="population"
            value="老年人口"
            onChange={(e) => labelcheck(e.target.value)}
            checked={selectedLabel === "老年人口"}
          />
          老年人口
        </div>
      </div>
      {population.length > 0 ? (
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          ref={chartComponentRef}
        />
      ) : (
        <p>データがありません</p>
      )}
    </div>
  );
}
