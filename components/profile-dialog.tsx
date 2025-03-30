"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "@/components/ui/image-upload"
import { z } from "zod"

const formSchema = z.object({
  name: z.string().min(1, "Il nome è obbligatorio"),
  email: z.string().email("Email non valida"),
  image: z.string().optional(),
  phone: z.string().optional(),
  level: z.enum(["beginner", "intermediate", "advanced", "pro"]),
  preferredSport: z.enum(["tennis", "padel", "pickleball"]),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: FormValues & { availability: TimeSlot[] }) => void
  defaultValues?: Partial<FormValues & { availability: TimeSlot[] }>
}

interface TimeSlot {
  dayOfWeek: string
  startTime: string
  endTime: string
}

const days = [
  { value: "monday", label: "Lunedì" },
  { value: "tuesday", label: "Martedì" },
  { value: "wednesday", label: "Mercoledì" },
  { value: "thursday", label: "Giovedì" },
  { value: "friday", label: "Venerdì" },
  { value: "saturday", label: "Sabato" },
  { value: "sunday", label: "Domenica" },
]

const levels = [
  { value: "beginner", label: "Principiante" },
  { value: "intermediate", label: "Intermedio" },
  { value: "advanced", label: "Avanzato" },
  { value: "pro", label: "Pro" },
]

const sports = [
  { value: "tennis", label: "Tennis" },
  { value: "padel", label: "Padel" },
  { value: "pickleball", label: "Pickleball" },
]

export function ProfileDialog({ 
  open, 
  onOpenChange, 
  onSubmit,
  defaultValues 
}: ProfileDialogProps) {
  const [selectedDays, setSelectedDays] = useState<string[]>(
    defaultValues?.availability?.map(a => a.dayOfWeek) || []
  )
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(
    defaultValues?.availability || []
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      name: "",
      email: "",
      image: "",
      phone: "",
      level: "beginner",
      preferredSport: "tennis",
      notes: "",
    }
  })

  const handleSubmit = (values: FormValues) => {
    onSubmit({
      ...values,
      availability: timeSlots
    })
  }

  const toggleDay = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter(d => d !== day))
      setTimeSlots(timeSlots.filter(slot => slot.dayOfWeek !== day))
    } else {
      setSelectedDays([...selectedDays, day])
    }
  }

  const addTimeSlot = (day: string) => {
    setTimeSlots([
      ...timeSlots,
      {
        dayOfWeek: day,
        startTime: "09:00",
        endTime: "10:00"
      }
    ])
  }

  const updateTimeSlot = (index: number, field: keyof TimeSlot, value: string) => {
    const updatedSlots = [...timeSlots]
    updatedSlots[index] = {
      ...updatedSlots[index],
      [field]: value
    }
    setTimeSlots(updatedSlots)
  }

  const removeTimeSlot = (index: number) => {
    const updatedSlots = timeSlots.filter((_, i) => i !== index)
    setTimeSlots(updatedSlots)

    // Se era l'ultimo slot per quel giorno, rimuovi il giorno dai selezionati
    const dayOfRemovedSlot = timeSlots[index].dayOfWeek
    if (!updatedSlots.some(slot => slot.dayOfWeek === dayOfRemovedSlot)) {
      setSelectedDays(selectedDays.filter(day => day !== dayOfRemovedSlot))
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {defaultValues ? "Modifica profilo" : "Crea nuovo profilo"}
          </DialogTitle>
          <DialogDescription>
            Inserisci i dettagli del profilo e le sue disponibilità
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-[200px_1fr] gap-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="col-span-1">
                    <FormLabel>Immagine</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={field.onChange}
                        disabled={form.formState.isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefono</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="level"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Livello</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona il livello" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {levels.map(level => (
                              <SelectItem key={level.value} value={level.value}>
                                {level.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredSport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sport preferito</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleziona lo sport" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sports.map(sport => (
                              <SelectItem key={sport.value} value={sport.value}>
                                {sport.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Note</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Disponibilità</h3>
              
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <Button
                    key={day.value}
                    type="button"
                    variant={selectedDays.includes(day.value) ? "default" : "outline"}
                    onClick={() => toggleDay(day.value)}
                  >
                    {day.label}
                  </Button>
                ))}
              </div>

              <div className="space-y-4">
                {selectedDays.map(day => (
                  <div key={day} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium capitalize">{days.find(d => d.value === day)?.label}</h4>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => addTimeSlot(day)}
                      >
                        Aggiungi orario
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {timeSlots
                        .filter(slot => slot.dayOfWeek === day)
                        .map((slot, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              type="time"
                              value={slot.startTime}
                              onChange={(e) => updateTimeSlot(index, "startTime", e.target.value)}
                              className="w-32"
                            />
                            <span>-</span>
                            <Input
                              type="time"
                              value={slot.endTime}
                              onChange={(e) => updateTimeSlot(index, "endTime", e.target.value)}
                              className="w-32"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTimeSlot(index)}
                              className="text-destructive"
                            >
                              Rimuovi
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annulla
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {defaultValues ? "Salva modifiche" : "Crea profilo"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
