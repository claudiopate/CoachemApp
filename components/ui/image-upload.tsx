"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ImagePlus, X } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (value: string) => void
  disabled?: boolean
  className?: string
}

export function ImageUpload({
  value,
  onChange,
  disabled,
  className
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert("L'immagine deve essere più piccola di 5MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const base64String = reader.result as string
      setPreview(base64String)
      onChange(base64String)
    }
    reader.readAsDataURL(file)
  }, [onChange])

  const handleRemove = useCallback(() => {
    setPreview(null)
    onChange("")
  }, [onChange])

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-center">
        {preview ? (
          <div className="relative w-32 h-32">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6"
              onClick={handleRemove}
              disabled={disabled}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="w-32 h-32 flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-lg text-muted-foreground">
            <ImagePlus className="h-8 w-8" />
            <span className="text-xs text-center">
              Click per caricare<br />o trascina qui
            </span>
          </div>
        )}
      </div>
      <Input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
        id="image-upload"
      />
      {!preview && (
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById("image-upload")?.click()}
          disabled={disabled}
          className="w-full"
        >
          Carica immagine
        </Button>
      )}
    </div>
  )
}
