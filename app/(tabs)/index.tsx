import { CustomText } from "@/components/custom-text/custom-text";
import { DaySelector } from "@/components/day-selector/day-selector";
import { colors } from "@/constants/colors";
import { useGeneratePlan } from "@/hooks/mutations/use-generate-plan";
import { DailyPlanPreviewScreen } from "@/screens/daily-plan-preview-screen/daily-plan-preview-screen";
import { GeneratePlanScreen } from "@/screens/generate-plan-screen/generate-plan-screen";
import { CookingLevel, DayMealPlan, FavoriteCuisines, PreferredCookingTime } from "@/types/api";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function PlanScreen() {
  const { mutate: generatePlan, data, isPending, error } = useGeneratePlan();
  const [selectedMealPlan, setSelectedMealPlan] = useState<DayMealPlan | undefined>(undefined);

  const handleSelectDay = (day: number) => {
    console.log("day", day);
    if (day) {
      setSelectedMealPlan(data?.plan?.week[day - 1]);
    }
  };

  const handleGeneratePlan = () => {
    generatePlan({
      favoriteCuisines: [FavoriteCuisines.MEDITERRANEAN],
      cookingLevel: CookingLevel.ADVANCED,
      preferredCookingTime: PreferredCookingTime.EXTENDED,
      numberOfAdults: 2,
      numberOfChildren: 3,
      optionalNotes:
        "Que haya de todo (pescado, carne, etc.). Intenta que sea comida andaluza. No uses muchas verduras, a los niños no les gusta mucho",
    });
  };

  if (isPending) {
    return (
      <View style={styles.contentContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.contentContainer}>
        <CustomText weight="bold">Error al generar el plan</CustomText>
        <CustomText weight="regular">{error.message}</CustomText>
      </View>
    );
  }

  // Renderizado condicional: mostrar el plan si existe, sino mostrar la pantalla de generación
  if (data) {
    return (
      <View style={styles.container}>
        <View style={styles.daySelectorContainer}>
          <DaySelector onSelectDay={handleSelectDay} />
        </View>
        <View style={styles.contentContainer}>
          <DailyPlanPreviewScreen dayMealPlan={selectedMealPlan} />
        </View>
      </View>
    );
  }

  // Si no hay data, mostrar la pantalla para generar el plan
  return (
    <View style={styles.container}>
      <View style={styles.daySelectorContainer}>
        <DaySelector onSelectDay={() => {}} />
      </View>
      <GeneratePlanScreen onGeneratePlan={handleGeneratePlan} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
  },
  daySelectorContainer: {
    marginBottom: 32,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
