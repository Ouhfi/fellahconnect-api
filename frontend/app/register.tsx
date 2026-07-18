import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { router } from "expo-router";
import { api } from "../services/api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [region, setRegion] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !username.trim() ||
      !firstName.trim() ||
      !lastName.trim() ||
      !phone.trim() ||
      !email.trim() ||
      !city.trim() ||
      !region.trim() ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    if (username.trim().length < 3) {
      Alert.alert("Erreur", "Le nom d'utilisateur doit contenir au moins 3 caractères");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas");
      return;
    }

    // Validation du numéro marocain (commence par +212 ou 0, puis 5-7, puis 8 chiffres)
    const phoneRegex = /^(\+212|0)[5-7][0-9]{8}$/;
    if (!phoneRegex.test(phone.trim())) {
      Alert.alert(
        "Erreur",
        "Numéro de téléphone invalide. Il doit commencer par 0 ou +212 (ex: 0612345678)"
      );
      return;
    }

    try {
      setLoading(true);
      await api.register({
        username: username.trim(),
        email: email.trim(),
        password,
        role: "farmer",
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        city: city.trim(),
        region: region.trim(),
      });

      Alert.alert("Succès", "Votre compte a été créé avec succès.");
      router.replace("/login" as any);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible de créer le compte.");
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
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.subtitle}>
            Inscrivez-vous pour commencer à gérer vos terres
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Nom d'utilisateur</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: mohamed_farmer"
            autoCapitalize="none"
            value={username}
            onChangeText={setUsername}
            editable={!loading}
          />

          <View style={styles.row}>
            <View style={styles.halfCol}>
              <Text style={styles.label}>Prénom</Text>
              <TextInput
                style={styles.input}
                placeholder="Prénom"
                value={firstName}
                onChangeText={setFirstName}
                editable={!loading}
              />
            </View>
            <View style={styles.halfCol}>
              <Text style={styles.label}>Nom</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom"
                value={lastName}
                onChangeText={setLastName}
                editable={!loading}
              />
            </View>
          </View>

          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 0612345678"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
            editable={!loading}
          />

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

          <View style={styles.row}>
            <View style={styles.halfCol}>
              <Text style={styles.label}>Ville</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Taroudant"
                value={city}
                onChangeText={setCity}
                editable={!loading}
              />
            </View>
            <View style={styles.halfCol}>
              <Text style={styles.label}>Région</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Souss-Massa"
                value={region}
                onChangeText={setRegion}
                editable={!loading}
              />
            </View>
          </View>

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

          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Répétez le mot de passe"
            secureTextEntry
            autoCapitalize="none"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            editable={!loading}
          />

          <Pressable style={styles.button} onPress={handleRegister} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Créer mon compte</Text>
            )}
          </Pressable>
        </View>

        <Pressable
          style={styles.linkContainer}
          onPress={() => router.push("/login" as any)}
          disabled={loading}
        >
          <Text style={styles.linkText}>
            Vous avez déjà un compte ?{" "}
            <Text style={styles.linkHighlight}>Se connecter</Text>
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
    marginBottom: 15,
    paddingVertical: 8,
  },
  backButtonText: {
    color: "#2e7d32",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  logo: {
    fontSize: 50,
    marginBottom: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 6,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfCol: {
    width: "48%",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    marginBottom: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#2e7d32",
    padding: 16,
    borderRadius: 10,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 5,
    alignItems: "center",
    marginBottom: 20,
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