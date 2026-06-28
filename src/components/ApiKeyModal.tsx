import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
} from "react-native";

interface Props {
  visible: boolean;
  onSave: (key: string) => void;
}

export default function ApiKeyModal({ visible, onSave }: Props) {
  const [key, setKey] = useState("");

  const handleSave = () => {
    const trimmed = key.trim();
    if (!trimmed) {
      Alert.alert("Error", "Please enter a valid API key.");
      return;
    }
    onSave(trimmed);
    setKey("");
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Open Router API Key</Text>
          <Text style={styles.subtitle}>
            Enter your Open Router API key to start chatting. Your key is stored locally on your
            device.
          </Text>
          <TextInput
            style={styles.input}
            value={key}
            onChangeText={setKey}
            placeholder="sk-or-v1-..."
            placeholderTextColor="#999"
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleSave}>
            <Text style={styles.buttonText}>Save</Text>
          </TouchableOpacity>
          <Text style={styles.hint}>
            Get your API key at{" "}
            <Text style={styles.link}>openrouter.ai/keys</Text>
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E5EA",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#1A1A1A",
    marginBottom: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  hint: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 12,
  },
  link: {
    color: "#007AFF",
  },
});
