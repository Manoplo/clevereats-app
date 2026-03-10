import { CustomText } from "@/components/custom-text/custom-text";
import { colors } from "@/constants/colors";
import { Pressable, StyleSheet, View } from "react-native";

interface GeneratePlanScreenProps {
  onGeneratePlan: () => void;
}

export const GeneratePlanScreen = (props: GeneratePlanScreenProps) => {
  const { onGeneratePlan } = props;

  return (
    <View style={styles.contentContainer}>
      <CustomText style={styles.title} weight="bold">
        Sin plan de comida aún.
      </CustomText>
      <CustomText style={styles.description} weight="regular">
        ¡Vamos a generar tu plan de comida!
      </CustomText>
      <Pressable style={styles.button} onPress={onGeneratePlan}>
        <CustomText style={styles.buttonText} weight="bold">
          Generar plan
        </CustomText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 48,
    textAlign: "center",
    width: "100%",
    lineHeight: 56,
    marginBottom: 16,
  },
  description: {
    fontSize: 20,
    textAlign: "center",
    width: "100%",
    lineHeight: 28,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 10,
    width: "100%",
    marginTop: 24,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
  },
});
