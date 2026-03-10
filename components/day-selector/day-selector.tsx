import { generateWeekDays } from "@/utils/week-days";
import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { Day } from "./day/day";

interface DaySelectorProps {
  onSelectDay: (day: number) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = (props) => {
  const { onSelectDay } = props;
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Generar los días de la semana actual
  const weekDays = generateWeekDays();

  const handleSelectDay = (day: number) => {
    setSelectedDay(day);
    onSelectDay(day);
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
      style={styles.scrollView}
    >
      {weekDays.map((weekDay) => (
        <Day
          selected={selectedDay === weekDay.dayNumber}
          onSelect={() => handleSelectDay(weekDay.dayNumber)}
          key={weekDay.dayNumber}
          day={weekDay.dayName}
          number={weekDay.dayOfMonth}
          disabled={false}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    width: "100%",
  },
  container: {
    flexDirection: "row",
    gap: 10,
    paddingVertical: 10,
  },
});
