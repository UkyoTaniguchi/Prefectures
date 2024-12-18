"use client";
import React, { useEffect, useState } from "react";

type Prefecture = {
  prefCode: number;
  prefName: string;
};
type PopulationData = {
  year: number;
  value: number;
  rate: number;
};
type PopulationCategory = {
  label: string;
  data: PopulationData[];
};

type PopulationResponse = {
  boundaryYear: number;
  data: PopulationCategory[];
};

export default function Checkbox() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
  const [selectedPrefectures, setSelectedPrefectures] = useState<{
    [key: number]: PopulationResponse | null;
  }>({});
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
      <div className="mt-5">
        {Object.entries(selectedPrefectures).map(
          ([prefCode, population], index) =>
            population && (
              <div key={prefCode} className="mb-5">
                <h2 className="text-lg font-bold">
                  都道府県コード: {prefCode} (境界年: {population.boundaryYear})
                </h2>
                {population.data.map((category, catIndex) => (
                  <div key={catIndex}>
                    <h3 className="font-semibold">{category.label}</h3>
                    <ul>
                      {category.data.map((item, itemIndex) => (
                        <li key={itemIndex}>
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
