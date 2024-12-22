import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const API_URL =
    "https://yumemi-frontend-engineer-codecheck-api.vercel.app/api/v1/population/composition/perYear";
  const API_KEY = process.env.YUMEMI_API_KEY;

  try {
    const { searchParams } = new URL(req.url);
    const prefCode = searchParams.get("prefCode");

    if (!prefCode) {
      return NextResponse.json(
        {
          message: "prefCodeが指定されていません",
        },
        { status: 400 }
      );
    }

    const response = await fetch(`${API_URL}?prefCode=${prefCode}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": API_KEY || "",
      },
    });

    if (!response.ok) {
      throw new Error(`外部のAPIの取得に失敗しました: ${response.statusText}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    const err = error as Error;
    console.error("エラー：", err);

    return NextResponse.json(
      {
        message: "人口データの取得に失敗しました",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
