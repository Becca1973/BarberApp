import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { NavigationProp } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  StyleSheet,
  Image,
} from "react-native";
import NewsComponent from "../components/NewsComponent";

// Define the Props type
type Props = {
  navigation: NavigationProp<any>;
};

type Barber = {
  id: string;
  name: string;
  description: string;
  image: string;
};

const Home: React.FC<Props> = ({ navigation }) => {
  const user: any = auth().currentUser ? auth().currentUser : {};
  const [barbers, setBarbers] = useState<Barber[]>([]);

  useEffect(() => {
    const fetchBarbers = async () => {
      try {
        const snapshot = await firestore()
          .collection("Barbers") // Poišči frizerje v zbirki "Barbers"
          .get();
        const barbersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(), // Spread the document data
        })) as Barber[];
        setBarbers(barbersList);
      } catch (error) {
        console.error("Error fetching barbers:", error);
      }
    };

    fetchBarbers();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/cover.jpg")} // Pot do vaše slike v mapi assets
        style={styles.cover}
        resizeMode="cover"
      />
      <Text style={styles.welcomeText}>Hello, {user?.displayName}</Text>
      <Text style={styles.headerText}>Choose Your Barber</Text>
      <View style={styles.barbersContainer}>
        {barbers.map((barber) => (
          <TouchableOpacity
            key={barber.id}
            onPress={() =>
              navigation.navigate("Booking", { barberId: barber.id })
            }
            style={styles.barberCard}
          >
            <View style={styles.barberTextContainer}>
              <Text style={styles.barberName}>{barber.name}</Text>
              <Text style={styles.barberDescription}>{barber.description}</Text>
            </View>
            <Image
              source={{ uri: barber.image }}
              style={styles.barberImage}
              resizeMode="cover"
            />
          </TouchableOpacity>
        ))}
      </View>
      {/* Dodane komponente za novice */}
      <NewsComponent />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 100,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
  },
  welcomeText: {
    fontSize: 23,
    fontWeight: "bold",
    marginBottom: 10,
  },
  emailText: {
    fontSize: 18,
    marginBottom: 20,
    color: "#666",
  },
  barbersContainer: {
    width: "100%",
    marginBottom: 20,
    backgroundColor: "#f5f5f5", // Barva ozadja
    borderRadius: 10, // Morebitno zaokroževanje robov
  },
  barberCard: {
    flexDirection: "row", // Postavitev elementov v vrstico
    alignItems: "center", // Poravnava elementov v sredino
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#ececec",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  barberTextContainer: {
    flex: 1, // Raztegljivost kontejnerja s besedilom
    marginRight: 20, // Razmik med besedilom in sliko
  },
  barberName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 5,
    textAlign: "center",
  },
  barberDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  cover: {
    marginBottom: 30,
    height: 400,
    borderRadius: 10, // Zaokroženi robovi
  },
  barberImage: {
    width: 150, // Nastavitev širine slike
    height: 150, // Nastavitev višine slike
    marginBottom: 10,
    borderRadius: 10, // Zaokroženi robovi
  },
});

export default Home;
