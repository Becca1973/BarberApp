import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Login from "../screens/Login";
import Signup from "../screens/Signup";
import Booking from "../screens/Booking";
import Appointments from "../screens/Appointments";
import Profile from "../screens/Profile";
import BarberDashboard from "../screens/BarberDashboard";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { ActivityIndicator, Image, StyleSheet, View } from "react-native";
import HomeIcon from "../assets/home-icon.png";
import AppointmentsIcon from "../assets/appointments-icon.png";
import MyAccountIcon from "../assets/my-account-icon.png";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const GlobalNavigation = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isBarber, setIsBarber] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async (user) => {
      if (user) {
        const barberDoc = await firestore()
          .collection("Barbers")
          .doc(user.uid)
          .get();
        if (barberDoc.exists) {
          setIsBarber(true);
          setIsLoggedIn(true);
        } else {
          const userDoc = await firestore()
            .collection("Users")
            .doc(user.uid)
            .get();
          if (userDoc.exists) {
            setIsBarber(false);
            setIsLoggedIn(true);
          } else {
            // User does not exist in either collection, handle accordingly
            setIsLoggedIn(false);
            setIsBarber(false);
          }
        }
      } else {
        setIsLoggedIn(false);
        setIsBarber(false);
      }
      setLoading(false); // Finished loading
    });

    return unsubscribe;
  }, []);

  if (loading) {
    // Show loading indicator or splash screen while checking auth state
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#f6880e" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {isLoggedIn ? (
        isBarber ? (
          <Stack.Screen
            name="BarberTabs"
            component={BarberTabs}
            options={{ headerShown: false }}
          />
        ) : (
          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
        )
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ headerShown: false }}
          />
        </>
      )}
      <Stack.Screen
        name="Booking"
        component={Booking}
        options={{ headerShown: true }}
      />
    </Stack.Navigator>
  );
};

const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
          let icon;

          switch (route.name) {
            case "Home":
              icon = HomeIcon;
              break;
            case "Appointments":
              icon = AppointmentsIcon;
              break;
            case "Profile":
              icon = MyAccountIcon;
              break;
          }
          return <Image source={icon} style={{ width: 30, height: 30 }} />;
        },
        tabBarStyle: styles.tabContainer,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Appointments"
        component={Appointments}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const BarberTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: () => {
          let icon;

          switch (route.name) {
            case "BarberDashboard":
              icon = HomeIcon; // Add appropriate icon for BarberDashboard
              break;
            case "Profile":
              icon = MyAccountIcon;
              break;
          }
          return <Image source={icon} style={{ width: 30, height: 30 }} />;
        },
        tabBarStyle: styles.tabContainer,
        tabBarShowLabel: false,
      })}
    >
      <Tab.Screen
        name="BarberDashboard"
        component={BarberDashboard}
        options={{ headerShown: false }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 70,
    backgroundColor: "#f6880e",
    elevation: 5,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GlobalNavigation;
