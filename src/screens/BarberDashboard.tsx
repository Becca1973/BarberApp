import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";

type Appointment = {
  id: string;
  userName: string;
  dateTime: string;
  service: string;
  approved: boolean;
};

const BarberDashboard: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const unsubscribe = firestore()
        .collection("reservations")
        .where("barberId", "==", user.uid)
        .onSnapshot((querySnapshot) => {
          const appointmentsData: Appointment[] = [];
          querySnapshot.forEach((documentSnapshot) => {
            const appointment = documentSnapshot.data();
            appointmentsData.push({
              id: documentSnapshot.id,
              userName: appointment.userEmail,
              dateTime: appointment.dateTime,
              service: appointment.service,
              approved: appointment.approved || false,
            });
          });
          setAppointments(appointmentsData);
          setLoading(false);
        });

      return () => unsubscribe();
    }
  }, []);

  const handleApprove = async (
    id: string,
    userEmail: string,
    service: string,
    dateTime: string
  ) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to approve this reservation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Approve",
          onPress: () => approveReservation(id, userEmail, service, dateTime),
        },
      ]
    );
  };

  const handleCancel = async (
    id: string,
    userEmail: string,
    service: string,
    dateTime: string
  ) => {
    Alert.alert(
      "Confirmation",
      "Are you sure you want to cancel this reservation?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Cancel Reservation",
          onPress: () => cancelReservation(id, userEmail, service, dateTime),
        },
      ]
    );
  };

  const approveReservation = async (
    id: string,
    userEmail: string,
    service: string,
    dateTime: string
  ) => {
    try {
      await firestore()
        .collection("reservations")
        .doc(id)
        .update({ approved: true });

      // Update local state to reflect approval
      setAppointments((prevAppointments) =>
        prevAppointments.map((appointment) =>
          appointment.id === id
            ? { ...appointment, approved: true }
            : appointment
        )
      );
    } catch (error) {
      console.error("Error approving reservation:", error);
    }
  };

  const cancelReservation = async (
    id: string,
    userName: string,
    service: string,
    dateTime: string
  ) => {
    try {
      // Delete reservation from Firestore
      await firestore().collection("reservations").doc(id).delete();

      // Update local state to remove the canceled appointment
      setAppointments((prevAppointments) =>
        prevAppointments.filter((appointment) => appointment.id !== id)
      );
    } catch (error) {
      console.error("Error canceling reservation:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (appointments.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.noAppointmentsText}>You have no appointments.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Appointment }) => {
    const dateTime = new Date(item.dateTime);
    const date = dateTime.toLocaleDateString();
    const time = dateTime.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    return (
      <View style={styles.appointmentItem}>
        <Text style={styles.service}>{item.service}</Text>
        <Text style={styles.userName}>{item.userName}</Text>
        <Text style={styles.date}>Date: {date}</Text>
        <Text style={styles.time}>Time: {time}</Text>
        {item.approved && <Text style={styles.approvedText}>Approved</Text>}
        <View style={styles.buttonsContainer}>
          {!item.approved && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.approveButton]}
                onPress={() =>
                  handleApprove(
                    item.id,
                    item.userName,
                    item.service,
                    item.dateTime
                  )
                }
              >
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() =>
                  handleCancel(
                    item.id,
                    item.userName,
                    item.service,
                    item.dateTime
                  )
                }
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Appointments</Text>
      <FlatList
        data={appointments}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 30,
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  appointmentItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    marginBottom: 10,
  },
  userName: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  date: {
    fontSize: 16,
    color: "#666",
  },
  time: {
    fontSize: 16,
    color: "#666",
  },
  service: {
    fontSize: 18,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 10,
  },
  approvedText: {
    fontSize: 16,
    color: "green",
    marginTop: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    justifyContent: "center",
    alignItems: "center",
    width: 100,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  approveButton: {
    backgroundColor: "#f6880e",
  },
  cancelButton: {
    backgroundColor: "#666",
  },
  noAppointmentsText: {
    fontSize: 18,
    color: "#666",
  },
});

export default BarberDashboard;
