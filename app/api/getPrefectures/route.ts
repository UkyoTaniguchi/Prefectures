import { NextResponse } from "next/server";

export async function GET() {
  const API_URL =
    "https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/prefectures";
  const API_KEY = process.env.YUMEMI_API_KEY;

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY || "",
      },
    });

    if (!response.ok) {
      throw new Error(`外部APIの取得に失敗しました: ${response.statusText}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    const err = error as Error;
    console.error("エラー：", err);

    return NextResponse.json(
      {
        message: "都道府県データの取得に失敗しました。",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
