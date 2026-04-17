"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api, CreateSalePayload } from "@/lib/api"

export function useContragents(token: string, phone?: string) {
  return useQuery({
    queryKey: ["contragents", token, phone],
    queryFn: () => api.contragents.list(token, { phone, limit: 20 }),
    enabled: !!token,
  })
}

export function useAllContragents(token: string) {
  return useQuery({
    queryKey: ["contragents", "all", token],
    queryFn: () => api.contragents.list(token, { limit: 1000 }),
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  })
}

export function useWarehouses(token: string) {
  return useQuery({
    queryKey: ["warehouses", token],
    queryFn: () => api.warehouses.list(token, { limit: 100 }),
    enabled: !!token,
  })
}

export function usePayboxes(token: string) {
  return useQuery({
    queryKey: ["payboxes", token],
    queryFn: () => api.payboxes.list(token, { limit: 100 }),
    enabled: !!token,
  })
}

export function useOrganizations(token: string) {
  return useQuery({
    queryKey: ["organizations", token],
    queryFn: () => api.organizations.list(token, { limit: 100 }),
    enabled: !!token,
  })
}

export function usePriceTypes(token: string) {
  return useQuery({
    queryKey: ["priceTypes", token],
    queryFn: () => api.priceTypes.list(token, { limit: 100 }),
    enabled: !!token,
  })
}

export function useNomenclatureSearch(token: string, name: string) {
  return useQuery({
    queryKey: ["nomenclature", token, name],
    queryFn: () =>
      api.nomenclature.search(token, { name, limit: 20, with_prices: true }),
    enabled: !!token && name.length >= 2,
  })
}

export function useCreateSale() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      token,
      data,
      generate_out,
    }: {
      token: string
      data: CreateSalePayload[]
      generate_out?: boolean
    }) => api.sales.create(token, data, generate_out),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] })
    },
  })
}

export function useValidateToken() {
  return useMutation({
    mutationFn: (token: string) => api.validateToken(token),
  })
}
