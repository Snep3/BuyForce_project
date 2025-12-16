import React from "react";
import { Tabs, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../../store/useStore";
import CustomHeader from "../../components/CustomHeader";

export default function TabLayout() {
  const isLoggedIn = useStore((state) => state.isLoggedIn);
  const router = useRouter();

  const requireAuth = (e: any) => {
    if (!isLoggedIn) {
      e.preventDefault();               // ⛔ stop tab navigation
      router.push("/(auth)/login");     // 👉 go to login
    }
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#2f95dc",
        tabBarInactiveTintColor: "gray",
        header: () => <CustomHeader />,
      }}
    >
      {/* PUBLIC */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      {/* PROTECTED */}
      <Tabs.Screen
        name="groups"
        options={{
          title: "My Groups",
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={24} color={color} />
          ),
        }}
        listeners={{ tabPress: requireAuth }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications" size={24} color={color} />
          ),
        }}
        listeners={{ tabPress: requireAuth }}
      />

      <Tabs.Screen
        name="wishlist"
        options={{
          title: "Wishlist",
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={24} color={color} />
          ),
        }}
        listeners={{ tabPress: requireAuth }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
        listeners={{ tabPress: requireAuth }}
      />
    </Tabs>
  );
}
