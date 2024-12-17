"use client";
import React, { useEffect, useState } from "react";

type Prefecture = {
  prefCode: number;
  prefName: string;
};

export default function Checkbox() {
  const [prefectures, setPrefectures] = useState<Prefecture[]>([]);
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

  return (
    <div>
      <h1>都道府県</h1>
      <ul>
        {prefectures.map((pref) => (
          <li key={pref.prefCode}>
            <label>
              <input type="checkbox" value={pref.prefName} />
              {pref.prefName}
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
