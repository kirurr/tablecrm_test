"use client"

import { useState, useMemo, memo } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, User, Loader2 } from "lucide-react"
import { useAllContragents } from "@/hooks/use-api"
import type { Contragent } from "@/lib/api"

interface ClientSearchProps {
  token: string
  disabled?: boolean
  value: Contragent | null
  onChange: (client: Contragent | null) => void
}

export const ClientSearch = memo(function ClientSearch({
  token,
  disabled,
  value,
  onChange,
}: ClientSearchProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const { data: allClients, isLoading } = useAllContragents(token)

  const filteredClients = useMemo(() => {
    if (!query.trim() || !allClients) return []

    const lowerQuery = query.toLowerCase().trim()

    return allClients
      .filter((client) => {
        const nameMatch = client.name?.toLowerCase().includes(lowerQuery)
        const phoneMatch = client.phone
          ?.replace(/\D/g, "")
          .includes(lowerQuery.replace(/\D/g, ""))
        return nameMatch || phoneMatch
      })
      .slice(0, 20)
  }, [allClients, query])

  const handleSelect = (client: Contragent) => {
    onChange(client)
    setQuery("")
    setIsOpen(false)
  }

  const handleClear = () => {
    onChange(null)
    setQuery("")
    setIsOpen(false)
  }

  if (value) {
    return (
      <div className="space-y-2">
        <Label>Клиент</Label>
        <div className="flex items-center gap-2 rounded-md border p-3">
          <User className="h-4 w-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium">{value.name}</p>
            {value.phone && (
              <p className="text-sm text-muted-foreground">{value.phone}</p>
            )}
          </div>
          <Badge variant="secondary">Выбран</Badge>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            disabled={disabled}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="client-search">Клиент</Label>
      <Input
        id="client-search"
        type="text"
        placeholder="Поиск по имени или телефону..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value)
          setIsOpen(true)
        }}
        onFocus={() => setIsOpen(true)}
        disabled={disabled}
      />

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : query.length > 0 && isOpen && filteredClients.length > 0 ? (
        <Card className="overflow-hidden">
          <ScrollArea className="h-full max-h-60">
            <div className="p-2">
              {filteredClients.map((client) => (
                <button
                  key={client.id}
                  type="button"
                  onClick={() => handleSelect(client)}
                  className="w-full rounded-md p-3 text-left transition-colors hover:bg-muted"
                  disabled={disabled}
                >
                  <p className="font-medium">{client.name}</p>
                  {client.phone && (
                    <p className="text-sm text-muted-foreground">
                      {client.phone}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      ) : query.length > 0 && isOpen && filteredClients.length === 0 ? (
        <p className="py-2 text-sm text-muted-foreground">Клиенты не найдены</p>
      ) : null}
    </div>
  )
})
