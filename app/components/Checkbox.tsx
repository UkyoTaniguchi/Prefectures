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
    <div className="mb-5">
      <div className="flex items-center gap-4 mb-3">
        <h1 className="text-xl font-bold">都道府県</h1>
        <div className="flex-grow h-0.5 bg-gray-500"></div>
      </div>
      <div className="grid grid-cols-3 xs:grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-4 text-base sm:text-lg">
        {prefectures.map((pref) => (
          <div key={pref.prefCode}>
            <input
              id={`checkbox-${pref.prefCode}`}
              type="checkbox"
              value={pref.prefName}
              onChange={(e) => handleCheck(pref.prefCode, e.target.checked)}
              className="hidden peer"
            />
            <label
              htmlFor={`checkbox-${pref.prefCode}`}
              className="border rounded-2xl px-3 py-1 cursor-pointer transition-all
              flex items-center justify-center hover:bg-slate-600
              peer-checked:bg-blue-500"
            >
              {pref.prefName}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
