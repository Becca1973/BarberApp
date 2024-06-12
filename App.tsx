import React from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import GlobalNavigation from "./src/navigation/GlobalNavigation";
import firestore from "@react-native-firebase/firestore";

// Omogočanje Firestore persistence
firestore()
  .settings({
    persistence: true,
  })
  .catch((err) => {
    console.error("Firestore persistence error:", err);
  });
let theme = {
  ...DefaultTheme,
  color: {
    ...DefaultTheme.colors,
    background: "#fff",
  },
};

export default function App() {
  return (
    <NavigationContainer theme={theme}>
      <GlobalNavigation />
    </NavigationContainer>
  );
}
