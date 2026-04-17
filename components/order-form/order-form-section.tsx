"use client"

import { memo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { OrderParameters } from "./order-parameters"

const orderSchema = z.object({
  comment: z.string().optional(),
})

type OrderFormData = z.infer<typeof orderSchema>

interface OrderFormSectionProps {
  token: string
  isAuthenticated: boolean
  selectedOrganization: number | undefined
  selectedWarehouse: number | undefined
  selectedPaybox: number | undefined
  selectedPriceType: number | undefined
  onOrganizationChange: (value: number | undefined) => void
  onWarehouseChange: (value: number | undefined) => void
  onPayboxChange: (value: number | undefined) => void
  onPriceTypeChange: (value: number | undefined) => void
  onCommentChange: (comment: string) => void
}

export const OrderFormSection = memo(function OrderFormSection({
  token,
  isAuthenticated,
  selectedOrganization,
  selectedWarehouse,
  selectedPaybox,
  selectedPriceType,
  onOrganizationChange,
  onWarehouseChange,
  onPayboxChange,
  onPriceTypeChange,
  onCommentChange,
}: OrderFormSectionProps) {
  const { register } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
  })

  const handleCommentChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onCommentChange(e.target.value)
    },
    [onCommentChange]
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Параметры заказа</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <OrderParameters
          token={token}
          isAuthenticated={isAuthenticated}
          selectedOrganization={selectedOrganization}
          selectedWarehouse={selectedWarehouse}
          selectedPaybox={selectedPaybox}
          selectedPriceType={selectedPriceType}
          onOrganizationChange={onOrganizationChange}
          onWarehouseChange={onWarehouseChange}
          onPayboxChange={onPayboxChange}
          onPriceTypeChange={onPriceTypeChange}
        />

        <div className="space-y-2">
          <Label htmlFor="comment">Комментарий</Label>
          <Input
            id="comment"
            placeholder="Комментарий к заказу"
            disabled={!isAuthenticated}
            {...register("comment")}
            onChange={handleCommentChange}
          />
        </div>
      </CardContent>
    </Card>
  )
})
