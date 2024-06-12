import auth from "@react-native-firebase/auth";
import React from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";

const Profile: React.FC = () => {
  const user: any = auth().currentUser ? auth().currentUser : {};

  const signout = () => {
    auth()
      .signOut()
      .catch((err) => console.log(err.message));
  };

  return (
    <ImageBackground
      source={require("../assets/coversignout.jpg")} // Poskrbite, da imate sliko v ustreznem imeniku
      style={styles.coverPhoto}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.info}>{user?.displayName || "N/A"}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.info}>{user?.email || "N/A"}</Text>
        </View>
        <Text style={styles.thankYouText}>
          Thank you for using our app! We hope you have a great experience.
        </Text>
        <TouchableOpacity
          onPress={() => signout()}
          style={styles.signoutButton}
        >
          <Text style={styles.signoutButtonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  coverPhoto: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Temen overlay za boljšo berljivost besedila
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    color: "#fff", // Bel tekst za boljši kontrast na temnem overlayu
    marginRight: 10,
    fontWeight: "bold",
  },
  info: {
    fontSize: 20,
    color: "#ccc", // Svetlo siv tekst
    fontWeight: "bold",
  },
  thankYouText: {
    fontSize: 16,
    marginBottom: 20,
    color: "#ccc", // Svetlo siv tekst
    textAlign: "center",
  },
  signoutButton: {
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f6880e",
    width: 150,
    justifyContent: "center",
  },
  signoutButtonText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default Profile;
