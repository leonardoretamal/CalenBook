/** Slot de tiempo disponible para reservar */
export interface AvailableSlotDTO {
  startTime: string; // ISO 8601
  endTime: string; // ISO 8601
}

/** Disponibilidad para una fecha específica */
export interface DayAvailabilityDTO {
  date: string; // YYYY-MM-DD
  slots: AvailableSlotDTO[];
}
