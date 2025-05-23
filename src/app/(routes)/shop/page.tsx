import { ProductData } from "@/src/models/product.model";
import { ACCESS_TOKEN_KEY } from "@/src/utils/constant";
import { Box } from "@mui/material";
import { cookies } from "next/headers";
import React from "react";
import ProductCard from "./ProductCard";

type Props = {};

export default async function shop({}: Props) {
  const cookieStore = cookies();
  const token = (await cookieStore).get(ACCESS_TOKEN_KEY);

  const result = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL_API}\/stock/product`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token?.value}`,
      },
    }
  );

  const products = (await result.json()) as ProductData[];

  return (
    <Box className="grid gap-2 grid-cols-fluid w-full">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </Box>
  );
}
