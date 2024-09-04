import tw from "twrnc";
import { Stack } from "expo-router";
import Constants from "expo-constants";
import React, { useEffect, useState } from "react";
import { View, StatusBar, LogBox } from "react-native";
import { LanguageProvider } from "../context/LanguageContext";
import { BookmarkProvider } from "../context/BookmarkContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Layout = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState(null);

  useEffect(() => {
    const checkFirstLaunch = async () => {
      const hasLaunched = await AsyncStorage.getItem("hasLaunched");
      setIsFirstLaunch(hasLaunched === null);
    };

    checkFirstLaunch();
  }, []);

  useEffect(() => {
    LogBox.ignoreAllLogs(); // Ignore all log notifications
  }, []);

  if (isFirstLaunch === null) return null;

  return (
    <SafeAreaProvider style={tw`flex-1`}>
      <ThemeProvider>
        <LanguageProvider>
          <BookmarkProvider>
            <ThemedLayout isFirstLaunch={isFirstLaunch} />
          </BookmarkProvider>
        </LanguageProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

function ThemedLayout({ isFirstLaunch }) {
  const { isDarkMode } = useTheme();
  const backgroundColor = isDarkMode ? "#282C35" : "#f1f1f1";
  const barStyle = isDarkMode ? "light-content" : "dark-content";

  return (
    <>
      <StatusBar barStyle={barStyle} backgroundColor={backgroundColor} />
      <View
        style={[
          tw`flex-1 pt-[${Constants.statusBarHeight}px]`,
          { backgroundColor },
        ]}
      >
        {isFirstLaunch ? (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="onboarding/screen1" />
            <Stack.Screen name="onboarding/screen2" />
            <Stack.Screen name="onboarding/screen3" />
          </Stack>
        ) : (
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="BookmarkNews/index" />
            <Stack.Screen name="ContactUs/index" />
            <Stack.Screen name="TermsOfService/index" />
            <Stack.Screen name="LinkViewer/index" />
            <Stack.Screen name="ImageViewer/index" />
            <Stack.Screen name="SingleArticle/index" />
          </Stack>
        )}
      </View>
    </>
  );
}

export default Layout;
