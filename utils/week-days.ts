/**
 * Utilidad para generar los días de la semana actual
 */

export interface WeekDay {
  dayNumber: number; // 1-7 (Lunes = 1, Domingo = 7)
  dayName: string; // "Lun", "Mar", "Mié", etc.
  dayNameFull: string; // "Lunes", "Martes", etc.
  date: Date; // Fecha completa del día
  dateString: string; // Fecha en formato ISO (YYYY-MM-DD)
  dayOfMonth: number; // Día del mes (1-31)
  month: number; // Mes (1-12)
  year: number; // Año
}

/**
 * Genera los 7 días de la semana actual (de lunes a domingo)
 * Calcula automáticamente el lunes de la semana actual
 * @returns Array con los 7 días de la semana actual
 */
export const generateWeekDays = (): WeekDay[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Calcular el lunes de la semana actual
  // getDay() retorna: 0 = domingo, 1 = lunes, 2 = martes, ..., 6 = sábado
  const dayOfWeek = today.getDay();

  // Calcular cuántos días retroceder para llegar al lunes
  // Si es domingo (0), retroceder 6 días. Si es lunes (1), retroceder 0 días, etc.
  const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

  // Crear la fecha del lunes
  const monday = new Date(today);
  monday.setDate(today.getDate() - daysToMonday);

  const weekDays: WeekDay[] = [];
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const dayNamesFull = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

  // Generar los 7 días de la semana (Lunes a Domingo)
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(monday);
    currentDate.setDate(monday.getDate() + i);

    const currentDayOfWeek = currentDate.getDay();
    // Convertir domingo (0) a 7 para mantener la numeración 1-7
    const dayNumber = currentDayOfWeek === 0 ? 7 : currentDayOfWeek;

    weekDays.push({
      dayNumber,
      dayName: dayNames[currentDayOfWeek],
      dayNameFull: dayNamesFull[currentDayOfWeek],
      date: new Date(currentDate),
      dateString: currentDate.toISOString().split("T")[0], // YYYY-MM-DD
      dayOfMonth: currentDate.getDate(),
      month: currentDate.getMonth() + 1, // getMonth() retorna 0-11
      year: currentDate.getFullYear(),
    });
  }

  return weekDays;
};

/**
 * Formatea una fecha para mostrar en la UI
 * @param date - Fecha a formatear
 * @param format - Formato deseado ('short' | 'long')
 * @returns Fecha formateada
 */
export const formatDate = (date: Date | string, format: "short" | "long" = "short"): string => {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (format === "short") {
    return dateObj.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
    });
  }

  return dateObj.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};
