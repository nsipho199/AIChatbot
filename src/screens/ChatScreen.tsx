import React, { useState, useRef, useCallback } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ChatMessage from "../components/ChatMessage";
import ChatInput from "../components/ChatInput";
import ApiKeyModal from "../components/ApiKeyModal";
import { sendMessage, setApiKey, getApiKey } from "../services/openrouter";
import type { ChatMessage as ChatMessageType } from "../types";

let messageIdCounter = 0;
function nextId(): string {
  messageIdCounter += 1;
  return `msg_${messageIdCounter}_${Date.now()}`;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showApiModal, setShowApiModal] = useState(!getApiKey());
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const handleApiKeySave = useCallback((key: string) => {
    setApiKey(key);
    setShowApiModal(false);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      if (!getApiKey()) {
        setShowApiModal(true);
        return;
      }

      const userMessage: ChatMessageType = {
        id: nextId(),
        role: "user",
        content: text,
        timestamp: Date.now(),
      };

      const assistantMessage: ChatMessageType = {
        id: nextId(),
        role: "assistant",
        content: "",
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setStreamingId(assistantMessage.id);
      setIsLoading(true);

      try {
        const history = [...messages, userMessage];
        let fullContent = "";

        await sendMessage(history, undefined, (chunk) => {
          fullContent += chunk;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMessage.id ? { ...m, content: fullContent } : m
            )
          );
        });

        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id ? { ...m, content: fullContent } : m
          )
        );
      } catch (error: any) {
        Alert.alert("Error", error.message || "Failed to get response from AI.");
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: `Error: ${error.message}` }
              : m
          )
        );
      } finally {
        setIsLoading(false);
        setStreamingId(null);
      }
    },
    [messages]
  );

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Chatbot</Text>
        <View style={styles.headerRight}>
          {getApiKey() && (
            <TouchableOpacity onPress={() => setShowApiModal(true)} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Key</Text>
            </TouchableOpacity>
          )}
          {messages.length > 0 && (
            <TouchableOpacity onPress={clearChat} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ChatMessage message={item} isStreaming={streamingId === item.id} />
        )}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>AI Chatbot</Text>
            <Text style={styles.emptySubtitle}>
              Send a message to start chatting with AI via Open Router.
            </Text>
          </View>
        }
      />

      {isLoading && streamingId && (
        <View style={styles.streamingIndicator}>
          <ActivityIndicator size="small" color="#007AFF" />
          <Text style={styles.streamingText}>AI is typing...</Text>
        </View>
      )}

      <ChatInput onSend={handleSend} disabled={isLoading} />

      <ApiKeyModal visible={showApiModal} onSave={handleApiKeySave} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
    backgroundColor: "#FFF",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#F2F2F7",
  },
  headerButtonText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  messageList: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#999",
    textAlign: "center",
    lineHeight: 22,
  },
  streamingIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    gap: 6,
  },
  streamingText: {
    fontSize: 13,
    color: "#999",
  },
});
