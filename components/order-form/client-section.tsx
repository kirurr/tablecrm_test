"use client"

import { memo, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientSearch } from "./client-search"
import type { Contragent } from "@/lib/api"

interface ClientSectionProps {
  token: string
  isAuthenticated: boolean
  value: Contragent | null
  onChange: (client: Contragent | null) => void
}

export const ClientSection = memo(function ClientSection({
  token,
  isAuthenticated,
  value,
  onChange,
}: ClientSectionProps) {
  const handleChange = useCallback(
    (client: Contragent | null) => {
      onChange(client)
    },
    [onChange]
  )

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Клиент</CardTitle>
      </CardHeader>
      <CardContent>
        <ClientSearch
          token={token}
          disabled={!isAuthenticated}
          value={value}
          onChange={handleChange}
        />
      </CardContent>
    </Card>
  )
})
