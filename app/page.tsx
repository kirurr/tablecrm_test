"use client"

import { useState, useCallback } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import {
  AuthSection,
  ClientSection,
  OrderFormSection,
  ProductsSection,
  SubmitButtons,
} from "@/components/order-form"
import { useCreateSale } from "@/hooks/use-api"
import type { Contragent, CartItem, CreateSalePayload } from "@/lib/api"

export default function OrderPage() {
  const [token, setToken] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Contragent | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedOrganization, setSelectedOrganization] = useState<
    number | undefined
  >()
  const [selectedWarehouse, setSelectedWarehouse] = useState<
    number | undefined
  >()
  const [selectedPaybox, setSelectedPaybox] = useState<number | undefined>()
  const [selectedPriceType, setSelectedPriceType] = useState<
    number | undefined
  >()
  const [comment, setComment] = useState("")

  const createSaleMutation = useCreateSale()

  const handleTokenChange = useCallback(
    (newToken: string, isValid: boolean) => {
      setToken(newToken)
      setIsAuthenticated(isValid)
      if (!isValid) {
        setSelectedClient(null)
        setCart([])
        setSelectedOrganization(undefined)
        setSelectedWarehouse(undefined)
        setSelectedPaybox(undefined)
        setSelectedPriceType(undefined)
        setComment("")
      }
    },
    []
  )

  const handleClientChange = useCallback((client: Contragent | null) => {
    setSelectedClient(client)
  }, [])

  const handleOrganizationChange = useCallback((value: number | undefined) => {
    setSelectedOrganization(value)
  }, [])

  const handleWarehouseChange = useCallback((value: number | undefined) => {
    setSelectedWarehouse(value)
  }, [])

  const handlePayboxChange = useCallback((value: number | undefined) => {
    setSelectedPaybox(value)
  }, [])

  const handlePriceTypeChange = useCallback((value: number | undefined) => {
    setSelectedPriceType(value)
  }, [])

  const handleCommentChange = useCallback((value: string) => {
    setComment(value)
  }, [])

  const handleAddToCart = useCallback((item: CartItem) => {
    setCart((prev) => [...prev, item])
  }, [])

  const handleUpdateQuantity = useCallback((id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }, [])

  const handleUpdatePrice = useCallback((id: string, price: number) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, price } : item))
    )
  }, [])

  const handleRemoveFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const handleCreateSale = useCallback(
    async (status: boolean) => {
      if (!selectedOrganization) {
        toast.error("Выберите организацию")
        return
      }

      if (cart.length === 0) {
        toast.error("Добавьте хотя бы один товар")
        return
      }

      const goods = cart.map((item) => ({
        nomenclature: item.nomenclature.id,
        price: item.price,
        quantity: item.quantity,
        price_type: item.price_type_id,
      }))

      const payload: CreateSalePayload = {
        organization: selectedOrganization,
        operation: "Заказ",
        order_source: "MOBILE",
        status: false,
        contragent: selectedClient?.id,
        warehouse: selectedWarehouse,
        paybox: selectedPaybox,
        goods,
        comment: comment || undefined,
      }

      console.log("Отправляемый payload:", payload)

      try {
        const result = await createSaleMutation.mutateAsync({
          token,
          data: [payload],
          generate_out: status,
        })

        if (status && result && result[0]?.id) {
          console.log(
            "Заказ создан, ID:",
            result[0].id,
            "- требуется проведение"
          )
        }
        console.log(status ? "Продажа проведена:" : "Заказ создан:", result)
        toast.success(status ? "Продажа создана и проведена!" : "Заказ создан!")

        setCart([])
        setSelectedClient(null)
        setSelectedWarehouse(undefined)
        setSelectedPaybox(undefined)
        setComment("")
      } catch (error) {
        console.error("Ошибка при создании продажи:", error)
        toast.error("Ошибка при создании продажи")
      }
    },
    [
      selectedOrganization,
      cart,
      selectedClient,
      selectedWarehouse,
      selectedPaybox,
      token,
      createSaleMutation,
      comment,
    ]
  )

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-10 border-b bg-background px-4 py-3">
        <h1 className="text-lg font-semibold">Оформление заказа</h1>
      </header>

      <ScrollArea className="h-[calc(100vh-57px)]">
        <div className="space-y-4 p-4 pb-24">
          <AuthSection
            onTokenChange={handleTokenChange}
            isAuthenticated={isAuthenticated}
          />

          <ClientSection
            token={token}
            isAuthenticated={isAuthenticated}
            value={selectedClient}
            onChange={handleClientChange}
          />

          <OrderFormSection
            token={token}
            isAuthenticated={isAuthenticated}
            selectedOrganization={selectedOrganization}
            selectedWarehouse={selectedWarehouse}
            selectedPaybox={selectedPaybox}
            selectedPriceType={selectedPriceType}
            onOrganizationChange={handleOrganizationChange}
            onWarehouseChange={handleWarehouseChange}
            onPayboxChange={handlePayboxChange}
            onPriceTypeChange={handlePriceTypeChange}
            onCommentChange={handleCommentChange}
          />

          <ProductsSection
            token={token}
            isAuthenticated={isAuthenticated}
            cart={cart}
            priceTypeId={selectedPriceType}
            onAddToCart={handleAddToCart}
            onUpdateQuantity={handleUpdateQuantity}
            onUpdatePrice={handleUpdatePrice}
            onRemove={handleRemoveFromCart}
          />
        </div>
      </ScrollArea>

      <SubmitButtons
        isAuthenticated={isAuthenticated}
        isPending={createSaleMutation.isPending}
        cartLength={cart.length}
        selectedOrganization={selectedOrganization}
        onCreateSale={handleCreateSale}
      />
    </div>
  )
}
