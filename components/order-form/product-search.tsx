"use client"

import { useState, useEffect, useId, memo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Plus, Loader2, Package } from "lucide-react"
import { useNomenclatureSearch } from "@/hooks/use-api"
import type { Nomenclature, CartItem } from "@/lib/api"

interface ProductSearchProps {
  token: string
  disabled?: boolean
  cart: CartItem[]
  onAddToCart: (item: CartItem) => void
  priceTypeId?: number
}

export const ProductSearch = memo(function ProductSearch({
  token,
  disabled,
  cart,
  onAddToCart,
  priceTypeId,
}: ProductSearchProps) {
  const [search, setSearch] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const generatedId = useId()

  const {
    data: products,
    isLoading,
    isFetching,
  } = useNomenclatureSearch(token, debouncedSearch)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
    }, 300)

    return () => clearTimeout(timer)
  }, [search])

  const isInCart = (productId: number) =>
    cart.some((item) => item.nomenclature.id === productId)

  const handleAddToCart = (product: Nomenclature) => {
    let price = 0

    if (product.prices && product.prices.length > 0) {
      const priceByType = priceTypeId
        ? product.prices.find((p) => p.price_type_id === priceTypeId)
        : product.prices[0]
      price = priceByType?.price || product.prices[0]?.price || 0
    }

    const cartItem: CartItem = {
      id: `${product.id}-${generatedId}`,
      nomenclature: product,
      quantity: 1,
      price,
      price_type_id: priceTypeId,
    }

    onAddToCart(cartItem)
    setSearch("")
    setDebouncedSearch("")
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="product-search">Поиск товара</Label>
      <Input
        id="product-search"
        type="text"
        placeholder="Введите название товара"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        disabled={disabled}
      />

      {isLoading || (isFetching && debouncedSearch.length >= 2) ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : debouncedSearch.length >= 2 && products && products.length > 0 ? (
        <Card className="overflow-hidden">
          <ScrollArea className="h-full max-h-72">
            <div className="space-y-2 p-2">
              {products.map((product) => {
                const inCart = isInCart(product.id)
                let price = 0
                let priceLabel = ""

                if (product.prices && product.prices.length > 0) {
                  const priceByType = priceTypeId
                    ? product.prices.find(
                        (p) => p.price_type_id === priceTypeId
                      )
                    : product.prices[0]
                  price = priceByType?.price || product.prices[0]?.price || 0
                  priceLabel = price
                    ? `${price.toLocaleString("ru-RU")} ₽`
                    : "Цена не указана"
                }

                return (
                  <div
                    key={product.id}
                    className="flex items-center justify-between gap-2 rounded-md border p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{product.name}</p>
                      <div className="mt-1 flex items-center gap-2">
                        {product.article && (
                          <Badge variant="outline" className="text-xs">
                            {product.article}
                          </Badge>
                        )}
                        {product.barcode && (
                          <span className="text-xs text-muted-foreground">
                            {product.barcode}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm font-medium">{priceLabel}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                      disabled={disabled || inCart}
                      variant={inCart ? "secondary" : "default"}
                    >
                      <Plus className="h-4 w-4" data-icon="inline-start" />
                      {inCart ? "В корзине" : "Добавить"}
                    </Button>
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </Card>
      ) : debouncedSearch.length >= 2 && products?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <Package className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Товары не найдены</p>
        </div>
      ) : debouncedSearch.length < 2 && debouncedSearch.length > 0 ? (
        <p className="py-2 text-sm text-muted-foreground">
          Введите минимум 2 символа для поиска
        </p>
      ) : null}
    </div>
  )
})
