import { CustomText } from "@/components/custom-text";
import { colors } from "@/constants/colors";
import AntDesign from '@expo/vector-icons/AntDesign';
import { Image } from "expo-image";
import { StyleSheet, TouchableOpacity, View } from "react-native";


export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2960&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" style={styles.image} />
      </View>
      <CustomText weight="bold" style={styles.title}>
        Clever
        <CustomText weight="bold" style={styles.titlePart2}>Eats</CustomText>
      </CustomText>
      <View style={styles.descriptionContainer}>  
        <CustomText style={styles.description}>Come más inteligente</CustomText>
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.googleButton} onPress={() => {
          console.log("Iniciar sesión con Google");
        }}>
          <AntDesign name="google" size={24} color="white" />
          <CustomText style={styles.googleButtonText}>Iniciar sesión con Google</CustomText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.appleButton} onPress={() => {
          console.log("Iniciar sesión con Apple");
        }}>
          <AntDesign name="apple" size={24} color="white" />
          <CustomText style={styles.appleButtonText}>Iniciar sesión con Apple</CustomText>
        </TouchableOpacity>
      </View>
      
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    
  },
  imageContainer: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 56,
    marginTop: 20,
  },
  titlePart2: {
    color: colors.primary,
    fontSize: 56,
  },
  descriptionContainer: {
    width: "100%",
    alignItems: "center",
  },
  description: {
    fontSize: 20,
  },
  buttonsContainer: {
    width: "100%",
    marginTop: 40,
    gap: 10,
  },
  googleButton: {
    backgroundColor: "#4285F4",
    padding: 24,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  googleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  appleButton: {
    backgroundColor: "#000",
    padding: 24,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  appleButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
