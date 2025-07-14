import type { NextApiRequest, NextApiResponse } from "next"
import { supabase } from "@/lib/supabase"

type Product = {
  id: number
  title: string
  description: string
  category: string
  price: number
  discount_percentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  sku: string
  weight: number
  dimensions: any
  warranty_information: string
  shipping_information: string
  availability_status: string
  return_policy: string
  minimum_order_quantity: number
  meta: any
  images: string[]
  thumbnail: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*") // Or your exact domain in production
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  let {
    search = "",
    category,
    sortBy = "price",
    order = "asc",
    limit = "10",
    skip = "0",
  } = req.query

  const numericLimit = parseInt(limit as string)
  const numericSkip = parseInt(skip as string)

  let query = supabase.from("products").select("*", { count: "exact" }) // includes total count for pagination

  // 🔍 Search (case-insensitive match on title or brand)
  if (search) {
    query = query.or(`title.ilike.%${search}%,brand.ilike.%${search}%`)
  }

  // 🏷️ Filter by category
  if (category) {
    query = query.eq("category", category)
  }

  // ↕️ Sorting
  if (sortBy) {
    query = query.order(sortBy as string, { ascending: order === "asc" })
  }

  // 📄 Pagination
  query = query.range(numericSkip, numericSkip + numericLimit - 1)

  const { data, count, error } = await query

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({
    products: data as Product[],
    total: count,
    skip: numericSkip,
    limit: numericLimit,
  })
}
