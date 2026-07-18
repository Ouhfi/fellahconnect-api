import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, ActivityIndicator } from "react-native";
import { router } from "expo-router";
import { storage } from "../services/api";

export default function Index() {
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await storage.getToken();
        if (token) {
          router.replace("/home" as any);
        }
      } catch (error) {
        console.warn("Failed to retrieve token:", error);
      } finally {
        setCheckingAuth(false);
      }
    };
    checkToken();
  }, []);

  if (checkingAuth) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2e7d32" />
        <Text style={styles.loaderText}>FellahConnect...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>🌱</Text>
        <Text style={styles.title}>FellahConnect</Text>
        <Text style={styles.subtitle}>
          L'espace agricole intelligent pour les agriculteurs marocains
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Pressable
          style={styles.loginButton}
          onPress={() => router.push("/login" as any)}
        >
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </Pressable>

        <Pressable
          style={styles.registerButton}
          onPress={() => router.push("/register" as any)}
        >
          <Text style={styles.registerButtonText}>Créer un compte</Text>
        </Pressable>
      </View>

      <Text style={styles.footer}>🇲🇦 FellahConnect v1.0.0</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F5",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 100,
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F5",
  },
  loaderText: {
    marginTop: 15,
    color: "#2e7d32",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    width: "100%",
    marginTop: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 10,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginTop: 15,
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
  },
  loginButton: {
    backgroundColor: "#2e7d32",
    padding: 16,
    width: "100%",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#2e7d32",
    padding: 16,
    width: "100%",
    borderRadius: 12,
    marginTop: 15,
    alignItems: "center",
  },
  registerButtonText: {
    color: "#2e7d32",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
});
