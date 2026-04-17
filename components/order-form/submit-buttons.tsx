"use client"

import { memo, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface SubmitButtonsProps {
  isAuthenticated: boolean
  isPending: boolean
  cartLength: number
  selectedOrganization?: number
  onCreateSale: (status: boolean) => Promise<void>
}

export const SubmitButtons = memo(function SubmitButtons({
  isAuthenticated,
  isPending,
  cartLength,
  selectedOrganization,
  onCreateSale,
}: SubmitButtonsProps) {
  const handleCreateDraft = useCallback(() => {
    onCreateSale(false)
  }, [onCreateSale])

  const handleCreateAndConfirm = useCallback(() => {
    onCreateSale(true)
  }, [onCreateSale])

  const isDisabled =
    !isAuthenticated || isPending || cartLength === 0 || !selectedOrganization

  return (
    <div className="fixed right-0 bottom-0 left-0 border-t bg-background p-4">
      <div className="mx-auto flex max-w-md gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleCreateDraft}
          disabled={isDisabled}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Создать заказ
        </Button>
        <Button
          className="flex-1"
          onClick={handleCreateAndConfirm}
          disabled={isDisabled}
        >
          {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Создать и провести
        </Button>
      </div>
    </div>
  )
})
