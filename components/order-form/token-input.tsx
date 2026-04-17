"use client"

import { useState, memo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, KeyRound } from "lucide-react"
import { useValidateToken } from "@/hooks/use-api"
import { toast } from "sonner"

interface TokenInputProps {
  onTokenChange: (token: string, isValid: boolean) => void
  disabled?: boolean
}

export const TokenInput = memo(function TokenInput({
  onTokenChange,
  disabled,
}: TokenInputProps) {
  const [token, setToken] = useState("")
  const [isValidating, setIsValidating] = useState(false)

  const validateMutation = useValidateToken()

  const handleSubmit = async () => {
    if (!token.trim()) {
      toast.error("Введите токен")
      return
    }

    setIsValidating(true)

    try {
      const isValid = await validateMutation.mutateAsync(token)

      if (isValid) {
        onTokenChange(token, true)
        toast.success("Авторизация успешна")
      } else {
        onTokenChange("", false)
        toast.error("Неверный токен")
      }
    } catch {
      onTokenChange("", false)
      toast.error("Ошибка авторизации")
    } finally {
      setIsValidating(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="token">Токен авторизации</Label>
      <div className="flex gap-2">
        <Input
          id="token"
          type="text"
          placeholder="Введите токен"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          disabled={disabled || isValidating}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={disabled || isValidating || !token.trim()}
          className="shrink-0"
        >
          {isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <KeyRound className="h-4 w-4" data-icon="inline-start" />
          )}
          Войти
        </Button>
      </div>
    </div>
  )
})
