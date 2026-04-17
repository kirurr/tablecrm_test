"use client"

import { memo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import type { CartItem } from "@/lib/api"

interface CartProps {
  disabled?: boolean
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onUpdatePrice: (id: string, price: number) => void
  onRemove: (id: string) => void
}

export const Cart = memo(function Cart({
  disabled,
  items,
  onUpdateQuantity,
  onUpdatePrice,
  onRemove,
}: CartProps) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (items.length === 0) {
    return (
      <div className="space-y-2">
        <Label>Корзина</Label>
        <Card className="flex flex-col items-center justify-center py-10 text-center">
          <ShoppingCart className="mb-2 h-10 w-10 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Добавьте товары из поиска
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>Корзина</Label>
        <Badge variant="secondary">
          {items.length} товар{items.length !== 1 ? "а" : ""}
        </Badge>
      </div>

      <Card className="overflow-hidden">
        <div className="max-h-80 space-y-3 overflow-y-auto p-3">
          {items.map((item) => (
            <div key={item.id} className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">
                    {item.nomenclature.name}
                  </p>
                  {item.nomenclature.article && (
                    <p className="text-xs text-muted-foreground">
                      {item.nomenclature.article}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(item.id)}
                  disabled={disabled}
                  className="shrink-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    disabled={disabled || item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    className="h-8 w-16 text-center"
                    value={item.quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      if (!isNaN(val) && val >= 1) {
                        onUpdateQuantity(item.id, val)
                      }
                    }}
                    disabled={disabled}
                    min={1}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    disabled={disabled}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <div className="flex-1">
                  <Input
                    type="number"
                    placeholder="Цена"
                    className="h-8"
                    value={item.price || ""}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value)
                      if (!isNaN(val) && val >= 0) {
                        onUpdatePrice(item.id, val)
                      }
                    }}
                    disabled={disabled}
                    min={0}
                    step={0.01}
                  />
                </div>

                <div className="min-w-[80px] shrink-0 text-right">
                  <p className="font-medium">
                    {(item.price * item.quantity).toLocaleString("ru-RU")} ₽
                  </p>
                </div>
              </div>

              <Separator />
            </div>
          ))}
        </div>

        <div className="border-t bg-muted/50 p-3">
          <div className="flex items-center justify-between">
            <span className="font-medium">Итого:</span>
            <span className="text-lg font-bold">
              {total.toLocaleString("ru-RU")} ₽
            </span>
          </div>
        </div>
      </Card>
    </div>
  )
})
