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
import AppInput from "../components/AppInput";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore"; // Uvoz Firestore
import { NavigationProp } from "@react-navigation/native";

// Define the Props type
type Props = {
  navigation: NavigationProp<any>;
};

// Define a type for the form values
type FormValues = {
  name: string;
  email: string;
  password: string;
};

const Signup: React.FC<Props> = ({ navigation }) => {
  const [values, setValues] = useState<FormValues>({
    name: "",
    email: "",
    password: "",
  });

  const updateInputval = (val: string, key: string) => {
    setValues((prevValues) => ({
      ...prevValues,
      [key]: val,
    }));
  };

  const singupSubmit = () => {
    console.log("values", values);
    if (!values.email || !values.password || !values.name) {
      Alert.alert("Enter the required fields.");
      return false;
    }

    auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((res) => {
        res.user.updateProfile({
          displayName: values.name,
        });

        // Dodajanje uporabnika v Firestore
        firestore()
          .collection("Users")
          .doc(res.user.uid)
          .set({
            name: values.name,
            email: values.email,
            createdAt: firestore.FieldValue.serverTimestamp(),
          })
          .then(() => {
            console.log("User added to Firestore!");
            setValues({ name: "", email: "", password: "" });
          })
          .catch((error) => {
            console.log("Error adding user to Firestore: ", error.message);
          });

        console.log("User Created Successfully!");
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
            <Text style={styles.title}>Sign up Here</Text>
          </View>
          <View style={styles.inputContainer}>
            <AppInput
              name="name"
              value={values.name}
              updateInputval={updateInputval}
              secure={false}
            />
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

          <TouchableOpacity onPress={singupSubmit} style={styles.signupButton}>
            <Text style={styles.signupButtonText}>Sign up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login");
            }}
            style={styles.loginLink}
          >
            <Text style={styles.loginLinkText}>Already have an account</Text>
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
  signupButton: {
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#f6880e",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    width: 150,
  },
  signupButtonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
  },
  loginLink: {
    padding: 20,
    marginVertical: 30,
  },
  loginLinkText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
  },
});

export default Signup;
