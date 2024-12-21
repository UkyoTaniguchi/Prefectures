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
    </div>
  );
}
