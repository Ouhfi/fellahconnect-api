import { useState, useRef } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { api } from "../services/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Salam sidi! Kifach ymken l'assistant FellahConnect i3awnk l'youm? Swalni 3la l'as3ar dyal l'khodra f souq, l'amrad dyal l'wraq, aw tariqat l'ghars.",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    setLoading(true);

    // Auto scroll down
    setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

    try {
      // Send message to the backend AI chat endpoint
      const result = await api.chat(textToSend, history);
      
      // Update with the backend generated response and conversation history
      if (result && result.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.response },
        ]);
      }
      if (result && result.history) {
        setHistory(result.history);
      }
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Chi haja ma khdmatch. 3awd jereb mn b3d.",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const suggestions = [
    "Taman dyal l'maticha f Casablanca 🍅",
    "Mochkil dyal sda f l'btata 🥔",
    "Taman dyal l'btata f Agadir",
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace("/home" as any)}
        >
          <Text style={styles.backButtonText}>←</Text>
        </Pressable>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>🤖 Conseiller FellahConnect</Text>
          <Text style={styles.headerSubtitle}>Assistant Agricole Intelligent</Text>
        </View>
      </View>

      {/* Messages Scroll Area */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messageList}
        contentContainerStyle={styles.messageListContent}
        onContentSizeChange={() =>
          scrollViewRef.current?.scrollToEnd({ animated: true })
        }
      >
        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          return (
            <View
              key={index}
              style={[
                styles.messageContainer,
                isUser ? styles.userContainer : styles.assistantContainer,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isUser ? styles.userBubble : styles.assistantBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isUser ? styles.userText : styles.assistantText,
                  ]}
                >
                  {msg.content}
                </Text>
              </View>
            </View>
          );
        })}

        {loading && (
          <View style={[styles.messageContainer, styles.assistantContainer]}>
            <View style={[styles.messageBubble, styles.assistantBubble, styles.loadingBubble]}>
              <ActivityIndicator size="small" color="green" />
              <Text style={styles.loadingText}>FellahConnect AI katfaker...</Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Suggestions Quick-Tap */}
      {messages.length === 1 && !loading && (
        <View style={styles.suggestionsContainer}>
          <Text style={styles.suggestionsTitle}>Jereb swalni 3la :</Text>
          <View style={styles.suggestionRow}>
            {suggestions.map((sug, idx) => (
              <Pressable
                key={idx}
                style={styles.suggestionChip}
                onPress={() => sendMessage(sug)}
              >
                <Text style={styles.suggestionChipText}>{sug}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      )}

      {/* Footer Input */}
      <View style={styles.footer}>
        <TextInput
          style={styles.input}
          placeholder="Kteb l'assistant dyalk hna..."
          value={inputText}
          onChangeText={setInputText}
          editable={!loading}
          onSubmitEditing={() => sendMessage(inputText)}
        />
        <Pressable
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={() => sendMessage(inputText)}
          disabled={loading || !inputText.trim()}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Envoyer</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#1b5e20",
    borderBottomWidth: 1,
    borderBottomColor: "#144316",
  },
  backButton: {
    padding: 10,
    marginRight: 10,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSubtitle: {
    color: "#e8f5e9",
    fontSize: 12,
  },
  messageList: {
    flex: 1,
  },
  messageListContent: {
    padding: 15,
    paddingBottom: 30,
  },
  messageContainer: {
    flexDirection: "row",
    marginBottom: 15,
    width: "100%",
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  assistantContainer: {
    justifyContent: "flex-start",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1.5,
    elevation: 1,
  },
  userBubble: {
    backgroundColor: "#2e7d32",
    borderBottomRightRadius: 2,
  },
  assistantBubble: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: "#eef1f0",
  },
  messageText: {
    fontSize: 15,
    lineHeight: 20,
  },
  userText: {
    color: "#fff",
  },
  assistantText: {
    color: "#333",
  },
  loadingBubble: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  loadingText: {
    color: "#666",
    marginLeft: 8,
    fontSize: 14,
  },
  suggestionsContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  suggestionsTitle: {
    fontSize: 13,
    color: "#666",
    marginBottom: 8,
    fontWeight: "600",
  },
  suggestionRow: {
    flexDirection: "column",
  },
  suggestionChip: {
    backgroundColor: "#e8f5e9",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#c8e6c9",
  },
  suggestionChipText: {
    color: "#2e7d32",
    fontSize: 14,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#eef1f0",
  },
  input: {
    flex: 1,
    height: 45,
    backgroundColor: "#f0f2f1",
    borderRadius: 22,
    paddingHorizontal: 20,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    color: "#333",
  },
  sendButton: {
    marginLeft: 10,
    height: 45,
    width: 80,
    backgroundColor: "#2e7d32",
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#c8e6c9",
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
});
