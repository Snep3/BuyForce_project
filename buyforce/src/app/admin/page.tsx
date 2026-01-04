"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    price: "",
    old_price: "",
    category: "",
    image_url: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async () => {
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: Number(form.price),
        old_price: Number(form.old_price),
      }),
    });

    alert("המוצר נוסף");
    router.push("/");
  };

  return (
    <main style={{ padding: 40, maxWidth: 500, margin: "auto" }}>
      <h1>Admin – Add Product</h1>

      <input name="name" placeholder="Name" onChange={handleChange} />
      <input name="price" placeholder="Price" onChange={handleChange} />
      <input name="old_price" placeholder="Old Price" onChange={handleChange} />
      <input name="category" placeholder="Category" onChange={handleChange} />
      <input name="image_url" placeholder="Image URL" onChange={handleChange} />

      <button onClick={submit}>Add Product</button>
    </main>
  );
}
