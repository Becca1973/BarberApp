// Import the required modules
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { NavigationProp } from "@react-navigation/native";

// Define the Props type
type Props = {
  navigation: NavigationProp<any>;
};

// Define the types for the data retrieved from Firestore
type BookingRouteProp = RouteProp<{ params: { barberId: string } }, "params">;

interface Barber {
  name: string;
  description: string;
  image: string;
  phone: string; // Add phone field
  email: string; // Add email field
  services: FirebaseFirestoreTypes.DocumentReference[];
}

interface Service {
  id: string;
  name: string;
  price: number;
}

// Define the Booking component
const Booking: React.FC<Props> = ({ navigation }) => {
  const route = useRoute<BookingRouteProp>();
  const { barberId } = route.params;
  const [barber, setBarber] = useState<Barber | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Get the user's email address
    const user = auth().currentUser;
    if (user) {
      setUserEmail(user.email);
    }

    const fetchBarberDetails = async () => {
      try {
        const barberRef = firestore().collection("Barbers").doc(barberId);
        const barberSnapshot = await barberRef.get();
        const barberData = barberSnapshot.data() as Barber | undefined;
        setBarber(barberData || null);

        if (
          barberData &&
          barberData.services &&
          Array.isArray(barberData.services)
        ) {
          const servicePromises = barberData.services.map(
            async (serviceRef: FirebaseFirestoreTypes.DocumentReference) => {
              const serviceSnapshot = await serviceRef.get();
              return {
                id: serviceSnapshot.id,
                ...serviceSnapshot.data(),
              } as Service;
            }
          );
          const servicesList = await Promise.all(servicePromises);
          setServices(servicesList);
        } else {
          console.error(
            "Barber services are not defined or not in the expected format"
          );
          Alert.alert("Error", "Failed to fetch barber details.");
        }
      } catch (error) {
        console.error("Error fetching barber details: ", error);
        Alert.alert("Error", "Failed to fetch barber details.");
      }
    };

    fetchBarberDetails();
  }, [barberId]);

  const handleServiceSelection = (service: Service) => {
    setSelectedService(service);
  };

  const handleBookingConfirmation = () => {
    if (selectedService && selectedDateTime) {
      const userId = auth().currentUser?.uid;

      if (!userId) {
        console.error("User is not logged in.");
        Alert.alert("Error", "You must be logged in to book a service.");
        return;
      }

      const reservationId = firestore().collection("reservations").doc().id;

      const newReservation = {
        id: reservationId,
        barberId: barberId,
        userId: userId,
        userEmail: userEmail,
        service: selectedService.name,
        dateTime: selectedDateTime.toISOString(),
        price: selectedService.price,
      };

      firestore()
        .collection("reservations")
        .doc(reservationId)
        .set(newReservation)
        .then(() => {
          console.log("Reservation successfully added!");
          Alert.alert("Success", "Your reservation has been confirmed.");
          navigation.navigate("Home");
        })
        .catch((error) => {
          console.error("Error adding reservation: ", error);
          Alert.alert("Error", "Failed to confirm your reservation.");
        });
    } else {
      Alert.alert("Error", "Please select a service and date/time.");
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDateTime(date);
    hideDatePicker();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {barber && (
        <View style={styles.barberInfo}>
          <Image
            source={{ uri: barber.image }}
            style={styles.barberImage}
            resizeMode="cover"
          />
          <Text style={styles.barberName}>{barber.name}</Text>
          <Text style={styles.barberDescription}>{barber.description}</Text>
          <Text style={styles.contactInfo}>
            Contact me: {barber.email} | {barber.phone}
          </Text>
        </View>
      )}
      <View>
        <Text style={styles.sectionTitle}>Select Service:</Text>
      </View>
      <View style={styles.serviceSection}>
        <View>
          {services.map((service) => (
            <TouchableOpacity
              key={service.id}
              onPress={() => handleServiceSelection(service)}
              style={[
                styles.serviceButton,
                selectedService &&
                  selectedService.id === service.id &&
                  styles.selectedServiceButton,
              ]}
            >
              <Text style={styles.serviceText}>{service.name}</Text>
              <Text style={styles.servicePrice}>
                ${service.price.toFixed(2)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.dateTimeSection}>
        <Text style={styles.sectionTitle}>Choose Date and Time:</Text>
        <TouchableOpacity
          onPress={showDatePicker}
          style={styles.datePickerButton}
        >
          <Text style={styles.datePickerText}>
            {selectedDateTime
              ? selectedDateTime.toLocaleString()
              : "Select Date and Time"}
          </Text>
        </TouchableOpacity>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="datetime"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
      <TouchableOpacity
        onPress={handleBookingConfirmation}
        disabled={!selectedService || !selectedDateTime}
        style={[
          styles.confirmButton,
          (!selectedService || !selectedDateTime) &&
            styles.disabledConfirmButton,
        ]}
      >
        <Text style={styles.confirmButtonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Define the styles
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  barberInfo: {
    marginBottom: 20,
    alignItems: "center",
  },
  barberName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  barberDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  contactInfo: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
  serviceSection: {
    marginBottom: 20,
    width: "100%",
  },
  serviceButton: {
    padding: 15,
    margin: 5,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedServiceButton: {
    borderColor: "#f6880e",
    backgroundColor: "#ffe6cc",
  },
  serviceText: {
    fontSize: 16,
    color: "#333",
  },
  servicePrice: {
    fontSize: 16,
    color: "#666",
  },
  dateTimeSection: {
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  datePickerButton: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    width: "100%",
    alignItems: "center",
  },
  datePickerText: {
    fontSize: 16,
    color: "#333",
  },
  confirmButton: {
    padding: 15,
    marginVertical: 20,
    borderRadius: 10,
    backgroundColor: "#f6880e",
    width: 150,
    alignItems: "center",
  },
  disabledConfirmButton: {
    backgroundColor: "#ccc",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
    color: "#333",
    alignItems: "center",
  },
  barberImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default Booking;
