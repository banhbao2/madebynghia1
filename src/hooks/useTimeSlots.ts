import { useState, useEffect } from 'react'
import { operatingHours } from '@/lib/constants'

export interface TimeSlot {
  value: string
  label: string
  date: Date
}

// Helper function to parse time string (e.g., "11:00") and set it to a specific date
const setTimeOnDate = (date: Date, timeString: string): Date => {
  const [hours, minutes] = timeString.split(':').map(Number)
  const newDate = new Date(date)
  newDate.setHours(hours, minutes, 0, 0)
  return newDate
}

// Generate time slots starting 20 minutes from now, only during operating hours
const generateTimeSlots = (): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const now = new Date()
  const minTime = new Date(now.getTime() + 20 * 60000) // 20 minutes from now

  // Round up to next 15-minute interval
  const roundedMinutes = Math.ceil(minTime.getMinutes() / 15) * 15
  minTime.setMinutes(roundedMinutes)
  minTime.setSeconds(0)
  minTime.setMilliseconds(0)

  // Generate slots for the next 7 days
  const daysToCheck = 7
  let currentDay = new Date(minTime)
  currentDay.setHours(0, 0, 0, 0)

  for (let dayOffset = 0; dayOffset < daysToCheck; dayOffset++) {
    const checkDate = new Date(currentDay.getTime() + dayOffset * 24 * 60 * 60000)
    const dayOfWeek = checkDate.getDay()
    const hours = operatingHours[dayOfWeek as keyof typeof operatingHours]

    if (!hours) continue // Skip if restaurant is closed this day

    // Get opening and closing times for this day
    const openTime = setTimeOnDate(checkDate, hours.open)
    const closeTime = setTimeOnDate(checkDate, hours.close)

    // For today, start from minTime or opening time (whichever is later)
    let startTime: Date
    if (dayOffset === 0) {
      startTime = minTime > openTime ? minTime : openTime
    } else {
      startTime = openTime
    }

    // Generate 15-minute slots from opening to closing
    let currentSlot = new Date(startTime)

    // Round to next 15-minute interval
    const minutes = currentSlot.getMinutes()
    const roundedMinutes = Math.ceil(minutes / 15) * 15
    currentSlot.setMinutes(roundedMinutes)
    currentSlot.setSeconds(0)
    currentSlot.setMilliseconds(0)

    while (currentSlot <= closeTime) {
      const value = currentSlot.toISOString()
      const isToday = currentSlot.toDateString() === now.toDateString()
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60000)
      const isTomorrow = currentSlot.toDateString() === tomorrow.toDateString()

      let label = currentSlot.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit'
      })

      if (isToday) {
        label += ' (Heute)'
      } else if (isTomorrow) {
        label += ' (Morgen)'
      } else {
        label += ` (${currentSlot.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' })})`
      }

      slots.push({ value, label, date: new Date(currentSlot) })
      currentSlot = new Date(currentSlot.getTime() + 15 * 60000) // Add 15 minutes
    }
  }

  return slots
}

export function useTimeSlots() {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [closedMessage, setClosedMessage] = useState<string>('')

  useEffect(() => {
    const slots = generateTimeSlots()
    setTimeSlots(slots)

    if (slots.length > 0 && !selectedTime) {
      setSelectedTime(slots[0].value)
      setClosedMessage('')
    } else if (slots.length === 0) {
      // Check if we're currently closed or opening soon
      const now = new Date()
      const dayOfWeek = now.getDay()
      const todayHours = operatingHours[dayOfWeek as keyof typeof operatingHours]

      if (todayHours) {
        const openTime = setTimeOnDate(now, todayHours.open)
        const closeTime = setTimeOnDate(now, todayHours.close)

        if (now < openTime) {
          setClosedMessage(`Wir öffnen heute um ${todayHours.open} Uhr. Bestellungen können ab dann aufgegeben werden.`)
        } else if (now > closeTime) {
          // Find next opening day
          let nextDay = (dayOfWeek + 1) % 7
          let daysChecked = 0
          while (daysChecked < 7) {
            const nextDayHours = operatingHours[nextDay as keyof typeof operatingHours]
            if (nextDayHours) {
              const dayName = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'][nextDay]
              setClosedMessage(`Wir haben heute geschlossen. Nächste Öffnung: ${dayName} um ${nextDayHours.open} Uhr.`)
              break
            }
            nextDay = (nextDay + 1) % 7
            daysChecked++
          }
        }
      } else {
        setClosedMessage('Wir haben heute geschlossen. Bitte versuchen Sie es an einem anderen Tag.')
      }
    }
  }, [])

  return {
    timeSlots,
    selectedTime,
    setSelectedTime,
    closedMessage
  }
}
