import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function currencyFormat(valueInCents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(valueInCents / 100);
}

export function dateTimeFormat(date: Date) {
  return Intl.DateTimeFormat("en-US", {
    dateStyle: "long",
  }).format(date);
}
