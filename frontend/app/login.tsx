import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { api } from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (email.trim() === "" || password.trim() === "") {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    try {
      setLoading(true);
      await api.login(email.trim(), password);
      router.replace("/home" as any);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Email ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/" as any)}
        >
          <Text style={styles.backButtonText}>← Retour</Text>
        </Pressable>

        <View style={styles.header}>
          <Text style={styles.logo}>🌱</Text>
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>
            Accédez à votre espace FellahConnect
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Adresse Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: mohamed.ben@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!loading}
          />

          <Text style={styles.label}>Mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez votre mot de passe"
            secureTextEntry
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            editable={!loading}
          />

          <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Se connecter</Text>
            )}
          </Pressable>
        </View>

        <Pressable
          style={styles.linkContainer}
          onPress={() => router.push("/register" as any)}
          disabled={loading}
        >
          <Text style={styles.linkText}>
            Vous n'avez pas de compte ?{" "}
            <Text style={styles.linkHighlight}>Créer un compte</Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F5",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 20,
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#2e7d32",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    fontSize: 50,
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
  form: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 18,
    color: "#333",
  },
  button: {
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 10,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  linkText: {
    fontSize: 14,
    color: "#666",
  },
  linkHighlight: {
    color: "#2e7d32",
    fontWeight: "bold",
  },
});
