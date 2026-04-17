import { z } from "zod"

const BASE_URL = "https://app.tablecrm.com/api/v1"

export const contragentSchema = z.object({
  id: z.number(),
  name: z.string(),
  phone: z.string().optional(),
  inn: z.string().optional(),
  created_at: z.number(),
  updated_at: z.number(),
})

export const warehouseSchema = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string().optional(),
  is_active: z.boolean(),
  created_at: z.number(),
  updated_at: z.number(),
})

export const payboxSchema = z.object({
  id: z.number(),
  name: z.string(),
  is_active: z.boolean(),
  created_at: z.number(),
  updated_at: z.number(),
})

export const organizationSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  full_name: z.string().optional(),
  short_name: z.string().optional(),
  inn: z.string().optional(),
  address: z.string().optional(),
  is_active: z.boolean().optional(),
  created_at: z.number(),
  updated_at: z.number(),
})

export const priceTypeSchema = z.object({
  id: z.number(),
  name: z.string(),
  is_default: z.boolean(),
  created_at: z.number(),
  updated_at: z.number(),
})

export const nomenclaturePriceSchema = z.object({
  price_type_id: z.number(),
  price: z.number(),
})

export const nomenclatureSchema = z.object({
  id: z.number(),
  name: z.string(),
  article: z.string().optional(),
  barcode: z.string().optional(),
  prices: z.array(nomenclaturePriceSchema).optional(),
  balance: z.number().optional(),
  created_at: z.number(),
  updated_at: z.number(),
})

const baseResponse = z.union([
  z.array(z.any()),
  z.object({ result: z.array(z.any()) }),
  z.object({ results: z.array(z.any()) }),
  z.object({ items: z.array(z.any()) }),
])

export type Contragent = z.infer<typeof contragentSchema>
export type Warehouse = z.infer<typeof warehouseSchema>
export type Paybox = z.infer<typeof payboxSchema>
export type Organization = z.infer<typeof organizationSchema>
export type PriceType = z.infer<typeof priceTypeSchema>
export type Nomenclature = z.infer<typeof nomenclatureSchema>

export interface CartItem {
  id: string
  nomenclature: Nomenclature
  quantity: number
  price: number
  price_type_id?: number
}

export interface SaleItem {
  nomenclature: number
  price: number
  quantity: number
  unit?: number
  unit_name?: string
  price_type?: number
  discount?: number
  sum_discounted?: number
}

export interface CreateSalePayload {
  organization: number
  operation?: "Заказ" | "ЗаказПродажа" | "Продажа" | "Возврат"
  dated?: number
  tags?: string
  comment?: string
  order_source?: string
  client?: number
  contragent?: number
  contract?: number
  warehouse?: number
  paybox?: number
  tax_included?: boolean
  tax_active?: boolean
  settings?: Record<string, unknown>
  sales_manager?: number
  paid_rubles?: number
  paid_lt?: number
  status?: boolean
  goods?: SaleItem[]
  priority?: number
}

export interface SaleResponse {
  id: number
  number?: string
  dated: number
  operation: string
  status: boolean
  organization: number
  warehouse?: number
  contragent?: number
  paybox?: number
  goods: SaleItem[]
  created_at: number
  updated_at: number
}

type ListResponse =
  | unknown[]
  | { result?: unknown[] }
  | { results?: unknown[] }
  | { items?: unknown[] }

function extractList<T>(data: ListResponse): T[] {
  if (Array.isArray(data)) return data as T[]
  const obj = data as { result?: T[]; results?: T[]; items?: T[] }
  return obj.result ?? obj.results ?? obj.items ?? []
}

async function fetchList<T>(data: unknown): Promise<T[]> {
  const parsed = baseResponse.safeParse(data)
  if (!parsed.success) {
    console.error("API validation error:", parsed.error)
    return []
  }
  return extractList<T>(parsed.data)
}

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit & {
    params?: Record<string, string | number | boolean | undefined>
  }
): Promise<T> {
  const { params, ...fetchOptions } = options || {}

  let url = `${BASE_URL}${endpoint}`

  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, String(value))
      }
    })
    const queryString = searchParams.toString()
    if (queryString) {
      url += `?${queryString}`
    }
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers: {
      "Content-Type": "application/json",
      ...fetchOptions?.headers,
    },
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.detail || `API Error: ${response.status}`)
  }

  return response.json()
}

export const api = {
  contragents: {
    list: async (
      token: string,
      params?: {
        phone?: string
        name?: string
        limit?: number
        offset?: number
      }
    ) => {
      const data = await fetchApi<unknown>(`/contragents/`, {
        params: { token, ...params },
      })
      return fetchList<Contragent>(data)
    },
  },

  warehouses: {
    list: async (
      token: string,
      params?: { name?: string; limit?: number; offset?: number }
    ) => {
      const data = await fetchApi<unknown>("/warehouses/", {
        params: { token, ...params },
      })
      return fetchList<Warehouse>(data)
    },
  },

  payboxes: {
    list: async (
      token: string,
      params?: { name?: string; limit?: number; offset?: number }
    ) => {
      const data = await fetchApi<unknown>("/payboxes/", {
        params: { token, ...params },
      })
      return fetchList<Paybox>(data)
    },
  },

  organizations: {
    list: async (
      token: string,
      params?: { limit?: number; offset?: number }
    ) => {
      const data = await fetchApi<unknown>("/organizations/", {
        params: { token, ...params },
      })
      return fetchList<Organization>(data)
    },
  },

  priceTypes: {
    list: async (
      token: string,
      params?: { limit?: number; offset?: number }
    ) => {
      const data = await fetchApi<unknown>("/price_types/", {
        params: { token, ...params },
      })
      return fetchList<PriceType>(data)
    },
  },

  nomenclature: {
    search: async (
      token: string,
      params: {
        name?: string
        barcode?: string
        limit?: number
        with_prices?: boolean
      }
    ) => {
      const data = await fetchApi<unknown>("/nomenclature/", {
        params: { token, ...params },
      })
      return fetchList<Nomenclature>(data)
    },
  },

  sales: {
    create: (token: string, data: CreateSalePayload[], generate_out = true) =>
      fetchApi<SaleResponse[]>(
        `/docs_sales/?token=${token}&generate_out=${generate_out}`,
        {
          method: "POST",
          body: JSON.stringify(data),
        }
      ),
  },

  validateToken: async (token: string): Promise<boolean> => {
    try {
      const data = await api.organizations.list(token, { limit: 1 })
      return data !== undefined
    } catch {
      return false
    }
  },
}
