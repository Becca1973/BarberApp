import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
} from "react-native";
import AppInput from "../components/AppInput"; // Preverite pot do komponente AppInput
import auth from "@react-native-firebase/auth";
import { NavigationProp } from "@react-navigation/native";

// Define the Props type
type Props = {
  navigation: NavigationProp<any>;
};

const Login: React.FC<Props> = ({ navigation }) => {
  const [values, setValues] = useState({ email: "", password: "" });
  const updateInputval = (val: string, key: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: val,
    }));
  };

  const loginSubmit = () => {
    if (!values.email || !values.password) {
      Alert.alert("Enter the required fields.");
      return false;
    }
    auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then((res) => {
        console.log(res);
        setValues({ email: "", password: "" });
      })
      .catch((error) => console.log(error.message));
  };

  return (
    <ImageBackground
      source={require("../assets/coversignout.jpg")} // Poskrbite, da imate sliko v ustreznem imeniku
      style={styles.coverPhoto}
      resizeMode="cover"
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.overlay}>
          <View style={{ alignItems: "center" }}>
            <Text style={styles.title}>Login Here</Text>
          </View>
          <View style={styles.inputContainer}>
            <AppInput
              name="email"
              value={values.email}
              updateInputval={updateInputval}
              secure={false}
            />
            <AppInput
              name="password"
              value={values.password}
              updateInputval={updateInputval}
              secure={true}
            />
          </View>

          <TouchableOpacity onPress={loginSubmit} style={styles.signinButton}>
            <Text style={styles.signinButtonText}>Sign in</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Signup");
            }}
            style={styles.signupLink}
          >
            <Text style={styles.signupLinkText}>Create new account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
    padding: 20,
    width: 360,
  },
  title: {
    fontSize: 30,
    color: "#f6880e",
    marginVertical: 10,
    fontWeight: "bold",
  },
  inputContainer: {
    marginVertical: 30,
    width: "100%",
  },
  signinButton: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f6880e",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    width: 150,
  },
  signinButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
  },
  signupLink: {
    padding: 20,
    marginVertical: 30,
  },
  signupLinkText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
  },
});

export default Login;
