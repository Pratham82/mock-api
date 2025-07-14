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
  let { id } = req.query

  let query = supabase.from("products").select("*").eq("id", id).single()

  const { data, error } = await query

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.status(200).json({
    product: data,
  })
}
