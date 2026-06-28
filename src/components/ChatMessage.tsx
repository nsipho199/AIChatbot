import React from "react";
import { View, Text, StyleSheet } from "react-native";
import type { ChatMessage as ChatMessageType } from "../types";

interface Props {
  message: ChatMessageType;
  isStreaming?: boolean;
}

export default function ChatMessage({ message, isStreaming }: Props) {
  const isUser = message.role === "user";

  return (
    <View style={[styles.container, isUser ? styles.userContainer : styles.assistantContainer]}>
      <View style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}>
        <Text style={[styles.roleLabel, isUser ? styles.userLabel : styles.assistantLabel]}>
          {isUser ? "You" : "AI"}
        </Text>
        <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
          {message.content}
          {isStreaming && <Text style={styles.cursor}>|</Text>}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    flexDirection: "row",
  },
  userContainer: {
    justifyContent: "flex-end",
  },
  assistantContainer: {
    justifyContent: "flex-start",
  },
  bubble: {
    maxWidth: "80%",
    padding: 12,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: "#007AFF",
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: "#E9ECEF",
    borderBottomLeftRadius: 4,
  },
  roleLabel: {
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 4,
  },
  userLabel: {
    color: "rgba(255,255,255,0.8)",
  },
  assistantLabel: {
    color: "#666",
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
  },
  userText: {
    color: "#FFF",
  },
  assistantText: {
    color: "#1A1A1A",
  },
  cursor: {
    opacity: 0.7,
  },
});
