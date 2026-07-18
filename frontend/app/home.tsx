import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { api, storage } from "../services/api";

type SoilType = "Clay" | "Sandy" | "Loamy" | "Rocky";

export default function Home() {
  const [userName, setUserName] = useState("");
  const [lands, setLands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Récupérer les informations de l'utilisateur pour le message de bienvenue
      const userProfile = await api.getMe();
      if (userProfile && userProfile.user && userProfile.user.farmer) {
        const farmer = userProfile.user.farmer;
        setUserName(`${farmer.firstName} ${farmer.lastName}`);
      }

      // Récupérer les terrains du agriculteur connecté
      const landPlots = await api.getLandPlots();
      setLands(landPlots || []);
    } catch (error: any) {
      console.error(error);
      // Si la session a expiré ou s'il y a un problème de token, rediriger vers login
      if (
        error.message &&
        (error.message.includes("token") || error.message.includes("authorized"))
      ) {
        router.replace("/login" as any);
      } else {
        Alert.alert("Erreur", error.message || "Erreur de connexion avec le serveur.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await storage.removeToken();
    router.replace("/login" as any);
  };

  const getSoilStyle = (type: SoilType) => {
    switch (type) {
      case "Clay":
        return { bg: "#efebe9", text: "#5d4037", label: "Argileux" };
      case "Sandy":
        return { bg: "#fff9c4", text: "#f57f17", label: "Sableux" };
      case "Loamy":
        return { bg: "#e8f5e9", text: "#2e7d32", label: "Limoneux" };
      case "Rocky":
        return { bg: "#eceff1", text: "#37474f", label: "Rocheux" };
      default:
        return { bg: "#e0e0e0", text: "#333333", label: type };
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="green" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>🌱 FellahConnect</Text>

      <Text style={styles.welcome}>
        {userName ? `Bienvenue, ${userName} !` : "Bienvenue sur votre espace"}
      </Text>

      <View style={styles.buttonRow}>
        <Pressable
          style={[styles.actionButton, styles.addBtn]}
          onPress={() => router.push("/addLand" as any)}
        >
          <Text style={styles.actionButtonText}>+ Ajouter terrain</Text>
        </Pressable>

        <Pressable
          style={[styles.actionButton, styles.profileBtn]}
          onPress={() => router.push("/profil" as any)}
        >
          <Text style={styles.actionButtonText}>Mon Profil</Text>
        </Pressable>
      </View>

      <Pressable
        style={styles.aiCard}
        onPress={() => router.push("/aiChat" as any)}
      >
        <Text style={styles.aiCardEmoji}>🤖</Text>
        <View style={styles.aiCardContent}>
          <Text style={styles.aiCardTitle}>Assistant FellahConnect AI</Text>
          <Text style={styles.aiCardSubtitle}>
            Posez vos questions sur les prix du marché, les maladies et les conseils agricoles.
          </Text>
        </View>
      </Pressable>

      <Text style={styles.sectionTitle}>Mes Terrains ({lands.length})</Text>

      {lands.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Aucun terrain enregistré pour le moment.</Text>
          <Text style={styles.emptySubtext}>Ajoutez votre premier terrain pour commencer.</Text>
        </View>
      ) : (
        lands.map((land) => {
          const soilInfo = getSoilStyle(land.soilType);
          return (
            <View key={land.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.landName}>{land.name}</Text>
                <View style={[styles.badge, { backgroundColor: soilInfo.bg }]}>
                  <Text style={[styles.badgeText, { color: soilInfo.text }]}>
                    {soilInfo.label}
                  </Text>
                </View>
              </View>

              <View style={styles.cardBody}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Superficie :</Text>
                  <Text style={styles.infoVal}>{land.area} Hectares</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Ville :</Text>
                  <Text style={styles.infoVal}>{land.location}</Text>
                </View>
              </View>
            </View>
          );
        })
      )}

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 45,
    backgroundColor: "#F4F6F5",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F6F5",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: 6,
  },
  welcome: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
    color: "#555",
    fontWeight: "500",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  actionButton: {
    width: "48%",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  addBtn: {
    backgroundColor: "#2e7d32",
  },
  profileBtn: {
    backgroundColor: "#1976d2",
  },
  actionButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1b5e20",
    marginBottom: 14,
  },
  emptyContainer: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 15,
    color: "#555",
    fontWeight: "bold",
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 13,
    color: "#888",
    textAlign: "center",
    marginTop: 5,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eef1f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f2f1",
    paddingBottom: 8,
    marginBottom: 10,
  },
  landName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  badge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  cardBody: {},
  infoItem: {
    flexDirection: "row",
    marginBottom: 5,
  },
  infoLabel: {
    color: "#666",
    fontWeight: "500",
    width: 90,
    fontSize: 13,
  },
  infoVal: {
    color: "#333",
    fontWeight: "bold",
    fontSize: 13,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: "#d32f2f",
    padding: 14,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
    backgroundColor: "transparent",
  },
  logoutText: {
    color: "#d32f2f",
    fontSize: 15,
    fontWeight: "bold",
  },
  aiCard: {
    backgroundColor: "#e8f5e9",
    borderWidth: 1,
    borderColor: "#c8e6c9",
    borderRadius: 14,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  aiCardEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  aiCardContent: {
    flex: 1,
  },
  aiCardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#2e7d32",
    marginBottom: 3,
  },
  aiCardSubtitle: {
    fontSize: 12,
    color: "#558b2f",
    lineHeight: 16,
  },
});