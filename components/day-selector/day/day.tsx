import { CustomText } from "@/components/custom-text/custom-text";
import { colors } from "@/constants/colors";
import { Pressable, StyleSheet } from "react-native";

type DayProps = {
  day: string;
  number: number; // Día del mes para mostrar
  disabled: boolean;
  selected: boolean;
  onSelect: () => void; // Callback sin parámetros, el componente padre maneja el día
};

export const Day = (props: DayProps) => {
  const { day, number, disabled, selected, onSelect } = props;

  const handlePress = () => {
    onSelect();
  };

  const selectedStyle = selected ? styles.selected : { backgroundColor: colors.secondary };
  const pressableColor = disabled ? styles.disabled : selectedStyle;
  const pressableStyle = [styles.container, pressableColor];

  return (
    <Pressable style={pressableStyle} disabled={disabled} onPress={handlePress}>
      <CustomText style={[styles.day, selected ? styles.selectedForeground : {}]} weight="bold">
        {day}
      </CustomText>
      <CustomText style={[styles.number, selected ? styles.selectedForeground : {}]} weight="regular">
        {number}
      </CustomText>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 10,
    minWidth: 60,
    minHeight: 69,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  disabled: {
    backgroundColor: colors.disabled,
  },
  selected: {
    backgroundColor: colors.primary,
  },

  selectedForeground: {
    color: "white",
  },
  day: {
    fontSize: 10,
    color: colors.tertiary,
  },
  number: {
    fontSize: 18,
    color: colors.tertiary,
  },
});
