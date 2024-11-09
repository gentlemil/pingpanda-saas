interface IQuota {
  maxEventsPerMonth: number
  maxEventCategories: number
}

export const FREE_QUOTA: IQuota = {
  maxEventsPerMonth: 100,
  maxEventCategories: 3,
} as const

export const PRO_QUOTA: IQuota = {
  maxEventsPerMonth: 1000,
  maxEventCategories: 5,
} as const
