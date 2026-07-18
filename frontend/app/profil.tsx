import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { api } from "../services/api";

export default function Profil() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await api.getMe();
      setProfile(data.user);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible de charger le profil.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Aucune donnée de profil trouvée.</Text>
        <Pressable style={styles.backButton} onPress={() => router.replace("/home" as any)}>
          <Text style={styles.backButtonText}>Retour à l'accueil</Text>
        </Pressable>
      </View>
    );
  }

  const farmer = profile.farmer || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon Profil</Text>

      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nom complet :</Text>
          <Text style={styles.value}>
            {farmer.firstName} {farmer.lastName}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Email :</Text>
          <Text style={styles.value}>{profile.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Téléphone :</Text>
          <Text style={styles.value}>{farmer.phone}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Ville :</Text>
          <Text style={styles.value}>{farmer.city}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Région :</Text>
          <Text style={styles.value}>{farmer.region}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Statut de vérification :</Text>
          <Text
            style={[
              styles.value,
              styles.status,
              farmer.verificationStatus === "verified"
                ? styles.statusVerified
                : farmer.verificationStatus === "rejected"
                ? styles.statusRejected
                : styles.statusPending,
            ]}
          >
            {farmer.verificationStatus === "verified"
              ? "Vérifié"
              : farmer.verificationStatus === "rejected"
              ? "Rejeté"
              : "En attente"}
          </Text>
        </View>
      </View>

      <Pressable style={styles.backButton} onPress={() => router.replace("/home" as any)}>
        <Text style={styles.backButtonText}>Retour à l'accueil</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: "#F4F6F5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F5",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#eef1f0",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f1",
    paddingVertical: 15,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#666",
  },
  value: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
  },
  status: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 6,
    overflow: "hidden",
  },
  statusVerified: {
    color: "#2e7d32",
    backgroundColor: "#e8f5e9",
  },
  statusPending: {
    color: "#ef6c00",
    backgroundColor: "#fff3e0",
  },
  statusRejected: {
    color: "#d32f2f",
    backgroundColor: "#ffebee",
  },
  errorText: {
    fontSize: 16,
    color: "#d32f2f",
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  backButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
