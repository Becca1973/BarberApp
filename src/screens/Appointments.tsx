import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

type Appointment = {
  id: string;
  barberId: string;
  userId: string;
  date: string;
  time: string;
  service: string;
  dateTime: string; // Dodajte to polje za celotni datum in čas
};

const Appointments: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [barberData, setBarberData] = useState<{ [key: string]: string }>({});
  const user = auth().currentUser;

  useEffect(() => {
    const fetchAppointments = async () => {
      if (user) {
        const snapshot = await firestore()
          .collection("reservations")
          .where("userId", "==", user.uid)
          .get();
        const appointmentsList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Appointment[];
        setAppointments(appointmentsList);

        // Fetch barber data for each appointment
        const barberIds = appointmentsList.map(
          (appointment) => appointment.barberId
        );
        const barberDataMap: { [key: string]: string } = {};
        await Promise.all(
          barberIds.map(async (barberId) => {
            try {
              const barberDoc = await firestore()
                .collection("Barbers")
                .doc(barberId)
                .get();
              if (barberDoc.exists) {
                const barberName = barberDoc.data()?.name || "Unknown Barber";
                barberDataMap[barberId] = barberName;
              } else {
                console.log("Barber not found for ID:", barberId);
              }
            } catch (error) {
              console.error("Error fetching barber:", error);
            }
          })
        );
        setBarberData(barberDataMap);
      }
    };

    fetchAppointments();
  }, [user]);

  const renderItem = ({ item }: { item: Appointment }) => {
    console.log(item); // Dodajte ta console.log za preverjanje podatkov v item
    const barberName = barberData[item.barberId] || "Unknown Barber";
    const dateTime = new Date(item.dateTime);
    const date = dateTime.toLocaleDateString();
    const time = dateTime.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    const handleCancel = async () => {
      Alert.alert(
        "Cancel Appointment",
        "Are you sure you want to cancel this appointment?",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: async () => {
              try {
                await firestore()
                  .collection("reservations")
                  .doc(item.id)
                  .delete();
                console.log("Reservation deleted successfully!");
                // Posodobimo seznam rezervacij
                setAppointments((prevAppointments) =>
                  prevAppointments.filter(
                    (appointment) => appointment.id !== item.id
                  )
                );
              } catch (error) {
                console.error("Error deleting reservation:", error);
                Alert.alert("Error", "Failed to cancel the reservation.");
              }
            },
          },
        ]
      );
    };

    return (
      <View style={styles.appointmentContainer}>
        <View style={styles.detailsContainer}>
          <Text style={styles.serviceText}>
            {item.service}, {barberName}
          </Text>
          <Text style={styles.dateText}>Date: {date}</Text>
          <Text style={styles.timeText}>Time: {time}</Text>
        </View>
        <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Appointments</Text>
        <Text style={styles.notice}>
          If you have to cancel, please make sure to do it at least three days
          before the appointment. Our barbers will appreciate it!
        </Text>
      </View>
      <FlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.noAppointmentsText}>No appointments found.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    marginBottom: 10,
    marginTop: 30,
  },
  notice: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  appointmentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
    backgroundColor: "#ececec",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: "100%",
  },
  detailsContainer: {
    flex: 1,
  },
  barberIdText: {
    color: "#666",
    fontSize: 20,
  },
  dateText: {
    color: "#666",
    fontSize: 16,
  },
  timeText: {
    color: "#666",
    fontSize: 16,
  },
  serviceText: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  noAppointmentsText: {
    fontSize: 20,
    color: "#000",
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#f6880e",
    marginLeft: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default Appointments;
