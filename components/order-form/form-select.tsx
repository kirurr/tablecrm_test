"use client"

import { memo } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface Option {
  id: number
  name?: string
  short_name?: string
  full_name?: string
}

function getOptionLabel(option: Option): string {
  return option.short_name || option.full_name || option.name || "Без названия"
}

interface FormSelectProps {
  label: string
  value: number | undefined
  onValueChange: (value: number | undefined) => void
  options: Option[]
  isLoading?: boolean
  placeholder?: string
  disabled?: boolean
}

export const FormSelect = memo(function FormSelect({
  label,
  value,
  onValueChange,
  options,
  isLoading,
  placeholder = "Выберите...",
  disabled,
}: FormSelectProps) {
  const selectValue = value !== undefined ? String(value) : ""

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={selectValue}
        onValueChange={(val) => onValueChange(val ? Number(val) : undefined)}
        disabled={disabled || isLoading}
      >
        <SelectTrigger>
          {isLoading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Загрузка...</span>
            </div>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          {Array.isArray(options) &&
            options.map((option) => (
              <SelectItem key={option.id} value={option.id.toString()}>
                {getOptionLabel(option)}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
    </div>
  )
})
