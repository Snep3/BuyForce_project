import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT * FROM products");
  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, price, old_price, category, image_url } = body;

    const result = await pool.query(
      `INSERT INTO products (name, price, old_price, category, image_url)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, price, old_price, category, image_url]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}
