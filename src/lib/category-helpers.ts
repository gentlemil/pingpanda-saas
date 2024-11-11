import {
  addDays,
  addHours,
  endOfMonth,
  getDaysInMonth,
  isSameDay,
  isSameHour,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from 'date-fns'
import { Event } from '@prisma/client'
export type ITimePeriodObj = Record<string, number>

// timeRange 'month'
const getMonthlyObjToCountEvents = (): ITimePeriodObj => {
  const now = new Date()
  const daysInMonth = getDaysInMonth(now)
  const endOfTheMonth = endOfMonth(now)

  const monthDays: Date[] = Array.from({ length: daysInMonth }, (_, i) =>
    addDays(startOfMonth(now), i)
  ).sort(
    (date1, date2) => new Date(date1).getTime() - new Date(date2).getTime()
  )

  const obj: ITimePeriodObj = {}

  monthDays.forEach((day) => {
    obj[day.toISOString()] = 0
  })

  return obj
}

export const countEventsByMonthDay = (
  events: Event[],
  obj: ITimePeriodObj = getMonthlyObjToCountEvents()
): ITimePeriodObj => {
  events.forEach((event) => {
    const eventDate = addHours(event.createdAt, 1)

    for (const dayKey in obj) {
      const monthDay = new Date(dayKey)

      if (isSameDay(eventDate, monthDay)) {
        obj[dayKey] += 1
      }
    }
  })
  return obj
}

// timeRange 'week'
const getWeeklyObjToCountEvents = (): ITimePeriodObj => {
  const now = new Date()
  const startDay = startOfWeek(now, { weekStartsOn: 1 })

  const weekDays: Date[] = Array.from({ length: 7 }, (_, i) =>
    addDays(startOfDay(startDay), i)
  ).sort(
    (date1, date2) => new Date(date1).getTime() - new Date(date2).getTime()
  )

  const obj: ITimePeriodObj = {}

  weekDays.forEach((day: Date) => {
    obj[day.toISOString()] = 0
  })

  return obj
}

export const countEventsByWeekDay = (
  events: Event[],
  obj: ITimePeriodObj = getWeeklyObjToCountEvents()
): ITimePeriodObj => {
  events.forEach((event) => {
    const eventDate = addHours(event.createdAt, 1)

    for (const weekKey in obj) {
      const weekDay = new Date(weekKey)

      if (isSameDay(eventDate, weekDay)) {
        obj[weekKey] += 1
      }
    }
  })

  return obj
}

const getHourlyObjToCountEvents = (): ITimePeriodObj => {
  const hours: Date[] = Array.from({ length: 24 }, (_, i) =>
    addHours(startOfDay(new Date()), i)
  ).sort(
    (date1, date2) => new Date(date1).getTime() - new Date(date2).getTime()
  )

  const sortedHours = new Map(
    Object.entries(hours).sort(
      ([keyA], [keyB]) => new Date(keyA).getTime() - new Date(keyB).getTime()
    )
  )

  const obj: ITimePeriodObj = {}

  hours.forEach((hour: Date, index: number) => {
    obj[hour.toISOString()] = 0
  })

  return obj
}

// timeRange 'today'
export const countEventByHour = (
  events: Event[],
  obj: ITimePeriodObj = getHourlyObjToCountEvents()
): ITimePeriodObj => {
  events.forEach((event) => {
    const eventDate = addHours(event.createdAt, 1)

    for (const hourKey in obj) {
      const hourDate = new Date(hourKey)

      if (isSameHour(eventDate, hourDate)) {
        obj[hourKey] += 1
      }
    }
  })

  return obj
}
