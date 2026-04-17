"use client"

import { memo } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { TokenInput } from "./token-input"

interface AuthSectionProps {
  onTokenChange: (token: string, isValid: boolean) => void
  isAuthenticated: boolean
}

export const AuthSection = memo(function AuthSection({
  onTokenChange,
  isAuthenticated,
}: AuthSectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Авторизация</CardTitle>
        <CardDescription>Введите токен для доступа к кассе</CardDescription>
      </CardHeader>
      <CardContent>
        <TokenInput onTokenChange={onTokenChange} disabled={isAuthenticated} />
      </CardContent>
    </Card>
  )
})
