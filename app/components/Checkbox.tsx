"use client";
import React, { useEffect, useState } from "react";

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

type CheckboxProps = {
  selectedPrefectures: { [key: number]: PopulationResponse | null };
  setSelectedPrefectures: React.Dispatch<
    React.SetStateAction<{ [key: number]: PopulationResponse | null }>
  >;
  prefectures: Prefecture[];
  setPrefectures: React.Dispatch<React.SetStateAction<Prefecture[]>>;
};

export default function Checkbox({
  selectedPrefectures,
  setSelectedPrefectures,
  prefectures,
  setPrefectures,
}: CheckboxProps) {
  useEffect(() => {
    const fetchPrefectures = async () => {
      try {
        const response = await fetch("/api/getPrefectures");
        const data = await response.json();
        setPrefectures(data.result);
      } catch (error) {
        console.error("データ取得に失敗しました", error);
      }
    };

    fetchPrefectures();
  }, []);

  const handleCheck = async (prefCode: number, isChecked: boolean) => {
    if (isChecked) {
      const response = await fetch(`/api/getPopulation?prefCode=${prefCode}`);
      const data: { result: PopulationResponse } = await response.json();
      setSelectedPrefectures((prev) => ({
        ...prev,
        [prefCode]: data.result,
      }));
    } else {
      setSelectedPrefectures((prev) => {
        const updated = { ...prev };
        delete updated[prefCode];
        return updated;
      });
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-3">都道府県</h1>
      <div className="flex flex-wrap gap-5">
        {prefectures.map((pref) => (
          <div key={pref.prefCode}>
            <label>
              <input
                type="checkbox"
                value={pref.prefName}
                onChange={(e) => handleCheck(pref.prefCode, e.target.checked)}
              />
              {pref.prefName}
            </label>
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-3">選択された都道府県のデータ</h2>
        {Object.entries(selectedPrefectures).map(
          ([prefCode, population]) =>
            population && (
              <div key={prefCode} className="mb-5">
                <h3 className="text-lg font-semibold">
                  都道府県コード: {prefCode} (境界年: {population.boundaryYear})
                </h3>
                {population.data.map((category, index) => (
                  <div key={index}>
                    <h4>{category.label}</h4>
                    <ul>
                      {category.data.map((item, i) => (
                        <li key={i}>
                          年: {item.year}, 人口: {item.value}, 増加率:{" "}
                          {item.rate}%
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )
        )}
      </div>
    </div>
  );
}
