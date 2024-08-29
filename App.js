import { useEffect } from "react";
import { Slot } from "expo-router";
import { setupOneSignal } from "./context/SetupOneSignal";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  useEffect(() => {
    setupOneSignal();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Slot />
    </SafeAreaView>
  );
}
