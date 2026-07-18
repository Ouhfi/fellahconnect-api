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
} from "react-native";
import { router } from "expo-router";
import { api } from "../services/api";

type SoilType = "Clay" | "Sandy" | "Loamy" | "Rocky";

export default function AddLand() {
  const [name, setName] = useState("");
  const [surface, setSurface] = useState("");
  const [city, setCity] = useState("");
  const [soilType, setSoilType] = useState<SoilType | "">("");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !surface || !city || !soilType) {
      Alert.alert("Erreur", "Veuillez remplir tous les champs");
      return;
    }

    const areaNum = parseFloat(surface);
    if (isNaN(areaNum) || areaNum < 0.1) {
      Alert.alert("Erreur", "La surface doit être un nombre supérieur ou égal à 0.1 ha");
      return;
    }

    try {
      setLoading(true);
      await api.addLandPlot({
        name,
        area: areaNum,
        location: city,
        soilType: soilType as SoilType,
      });

      Alert.alert("Succès", "Terrain ajouté avec succès");
      router.replace("/home" as any);
    } catch (error: any) {
      Alert.alert("Erreur", error.message || "Impossible d'enregistrer le terrain.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ajouter un terrain</Text>

      <Text style={styles.label}>Nom du terrain</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Parcelle Nord, Champ de blé"
        value={name}
        onChangeText={setName}
        editable={!loading}
      />

      <Text style={styles.label}>Surface (en hectares)</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: 2.5"
        keyboardType="numeric"
        value={surface}
        onChangeText={setSurface}
        editable={!loading}
      />

      <Text style={styles.label}>Ville / Localisation</Text>
      <TextInput
        style={styles.input}
        placeholder="Ex: Taroudant, Berkane"
        value={city}
        onChangeText={setCity}
        editable={!loading}
      />

      <Text style={styles.label}>Type de sol</Text>
      <View style={styles.soilContainer}>
        {(["Clay", "Sandy", "Loamy", "Rocky"] as SoilType[]).map((type) => {
          const labels = {
            Clay: "Argileux (Clay)",
            Sandy: "Sableux (Sandy)",
            Loamy: "Limoneux (Loamy)",
            Rocky: "Rocheux (Rocky)",
          };
          const isSelected = soilType === type;
          return (
            <Pressable
              key={type}
              style={[styles.soilButton, isSelected && styles.soilButtonSelected]}
              onPress={() => setSoilType(type)}
              disabled={loading}
            >
              <Text
                style={[
                  styles.soilButtonText,
                  isSelected && styles.soilButtonTextSelected,
                ]}
              >
                {labels[type]}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable style={styles.button} onPress={handleSave} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Enregistrer le terrain</Text>
        )}
      </Pressable>

      <Pressable
        style={styles.cancelButton}
        onPress={() => router.replace("/home" as any)}
        disabled={loading}
      >
        <Text style={styles.cancelButtonText}>Annuler</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    paddingTop: 50,
    backgroundColor: "#F4F6F5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1b5e20",
    textAlign: "center",
    marginBottom: 30,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    marginBottom: 20,
    color: "#333",
  },
  soilContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  soilButton: {
    width: "48%",
    backgroundColor: "#eef1f0",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  soilButtonSelected: {
    backgroundColor: "#2e7d32",
    borderColor: "#2e7d32",
  },
  soilButtonText: {
    color: "#444",
    fontWeight: "600",
    fontSize: 13,
  },
  soilButtonTextSelected: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#2e7d32",
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 15,
    padding: 15,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#d32f2f",
    fontSize: 16,
    fontWeight: "bold",
  },
});