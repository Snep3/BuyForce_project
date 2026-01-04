import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { userId, productId } = await req.json();

    // מציאת / יצירת סל
    const cartRes = await pool.query(
      "SELECT id FROM carts WHERE user_id = $1",
      [userId]
    );

    let cartId = cartRes.rows[0]?.id;

    if (!cartId) {
      const newCart = await pool.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING id",
        [userId]
      );
      cartId = newCart.rows[0].id;
    }

    // הוספת מוצר
    await pool.query(
      `
      INSERT INTO cart_items (cart_id, product_id, quantity)
      VALUES ($1, $2, 1)
      `,
      [cartId, productId]
    );

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Cart error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  if (!userId) return NextResponse.json([]);

  const result = await pool.query(
    `
    SELECT
      cart_items.id,
      products.name,
      products.price,
      products.image_url,
      cart_items.quantity
    FROM carts
    JOIN cart_items ON carts.id = cart_items.cart_id
    JOIN products ON products.id = cart_items.product_id
    WHERE carts.user_id = $1
    `,
    [userId]
  );

  return NextResponse.json(result.rows);
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await pool.query("DELETE FROM cart_items WHERE id = $1", [id]);

  return NextResponse.json({ success: true });
}
