"use client"

import { memo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProductSearch } from "./product-search"
import { Cart } from "./cart"
import type { CartItem } from "@/lib/api"

interface ProductsSectionProps {
  token: string
  isAuthenticated: boolean
  cart: CartItem[]
  priceTypeId?: number
  onAddToCart: (item: CartItem) => void
  onUpdateQuantity: (id: string, quantity: number) => void
  onUpdatePrice: (id: string, price: number) => void
  onRemove: (id: string) => void
}

export const ProductsSection = memo(function ProductsSection({
  token,
  isAuthenticated,
  cart,
  priceTypeId,
  onAddToCart,
  onUpdateQuantity,
  onUpdatePrice,
  onRemove,
}: ProductsSectionProps) {
  const handleAddToCart = useCallback(
    (item: CartItem) => {
      onAddToCart(item)
    },
    [onAddToCart]
  )

  const handleUpdateQuantity = useCallback(
    (id: string, quantity: number) => {
      onUpdateQuantity(id, quantity)
    },
    [onUpdateQuantity]
  )

  const handleUpdatePrice = useCallback(
    (id: string, price: number) => {
      onUpdatePrice(id, price)
    },
    [onUpdatePrice]
  )

  const handleRemove = useCallback(
    (id: string) => {
      onRemove(id)
    },
    [onRemove]
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Товары</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ProductSearch
          token={token}
          disabled={!isAuthenticated}
          cart={cart}
          onAddToCart={handleAddToCart}
          priceTypeId={priceTypeId}
        />

        <Separator />

        <Cart
          disabled={!isAuthenticated}
          items={cart}
          onUpdateQuantity={handleUpdateQuantity}
          onUpdatePrice={handleUpdatePrice}
          onRemove={handleRemove}
        />
      </CardContent>
    </Card>
  )
})
