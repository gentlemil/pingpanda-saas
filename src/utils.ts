import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const parseColor = (color: string): number => {
  const hex = color.startsWith('#') ? color.slice(1) : color
  return parseInt(hex, 16)
}

export const toHexColor = (num: number): string => {
  return `#${num.toString(16).toUpperCase().padStart(6, '0')}`
}
