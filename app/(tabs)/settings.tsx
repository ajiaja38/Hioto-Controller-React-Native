import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Settings() {
  return (
    <SafeAreaView className="flex-1 bg-white p-4">
      <Text>Tab [Home|Settings]</Text>
    </SafeAreaView>
  );
}
