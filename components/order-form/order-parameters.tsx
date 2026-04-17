"use client"

import { memo } from "react"
import {
  useOrganizations,
  useWarehouses,
  usePayboxes,
  usePriceTypes,
} from "@/hooks/use-api"
import { FormSelect } from "./form-select"

interface OrderParametersProps {
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
}

export const OrderParameters = memo(function OrderParameters({
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
}: OrderParametersProps) {
  const { data: organizations, isLoading: isLoadingOrganizations } =
    useOrganizations(token)
  const { data: warehouses, isLoading: isLoadingWarehouses } =
    useWarehouses(token)
  const { data: payboxes, isLoading: isLoadingPayboxes } = usePayboxes(token)
  const { data: priceTypes, isLoading: isLoadingPriceTypes } =
    usePriceTypes(token)

  return (
    <>
      <FormSelect
        label="Организация *"
        value={selectedOrganization}
        onValueChange={onOrganizationChange}
        options={organizations || []}
        isLoading={isLoadingOrganizations}
        placeholder="Выберите организацию..."
        disabled={!isAuthenticated}
      />

      <FormSelect
        label="Склад"
        value={selectedWarehouse}
        onValueChange={onWarehouseChange}
        options={warehouses || []}
        isLoading={isLoadingWarehouses}
        placeholder="Выберите склад..."
        disabled={!isAuthenticated}
      />

      <FormSelect
        label="Счёт"
        value={selectedPaybox}
        onValueChange={onPayboxChange}
        options={payboxes || []}
        isLoading={isLoadingPayboxes}
        placeholder="Выберите счёт..."
        disabled={!isAuthenticated}
      />

      <FormSelect
        label="Тип цены"
        value={selectedPriceType}
        onValueChange={onPriceTypeChange}
        options={priceTypes || []}
        isLoading={isLoadingPriceTypes}
        placeholder="Выберите тип цены..."
        disabled={!isAuthenticated}
      />
    </>
  )
})
