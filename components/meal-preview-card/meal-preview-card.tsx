import { colors } from "@/constants/colors";
import { Meal } from "@/types/api";
import { StyleSheet, View } from "react-native";
import { CustomText } from "../custom-text/custom-text";

interface MealPreviewCardProps {
  meal: Meal;
  mealType: string;
}

export const MealPreviewCard: React.FC<MealPreviewCardProps> = (props) => {
  const { meal, mealType } = props;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText weight="bold">{mealType}</CustomText>
      </View>
      <View style={styles.content}>
        <CustomText weight="bold">{meal.name}</CustomText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
