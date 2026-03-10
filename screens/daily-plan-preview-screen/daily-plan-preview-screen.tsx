import { CustomText } from "@/components/custom-text/custom-text";
import { MealPreviewCard } from "@/components/meal-preview-card/meal-preview-card";
import { DayMealPlan } from "@/types/api";
import { StyleSheet, View } from "react-native";

interface DailyPlanPreviewScreenProps {
  dayMealPlan?: DayMealPlan;
}

export const DailyPlanPreviewScreen = (props: DailyPlanPreviewScreenProps) => {
  const { dayMealPlan } = props;

  console.log("dayMealPlan", dayMealPlan);

  if (!dayMealPlan) {
    return (
      <View style={styles.container}>
        <CustomText weight="bold">No hay plan de comida seleccionado</CustomText>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CustomText weight="bold">{dayMealPlan.day}</CustomText>
      <MealPreviewCard meal={dayMealPlan.breakfast} mealType="Desayuno" />
      <MealPreviewCard meal={dayMealPlan.meal} mealType="Almuerzo" />
      <MealPreviewCard meal={dayMealPlan.dinner} mealType="Cena" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
