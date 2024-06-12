<a name="readme-top"></a>

# Barber Reservation App

<!-- ABOUT THE PROJECT -->

## About The Project

![Main page Screen Shot][product-screenshot]

The Barber Reservation App is a comprehensive Android platform designed to simplify the process of booking and managing appointments with barbers. The application features a dual-user system where both clients and barbers can register, log in, and utilize a variety of functionalities tailored to their needs. The backend is powered by Firestore, ensuring a reliable and scalable database solution.

<!-- BUILT WITH -->

## Built With

The Barber App is built using the following technologies and frameworks:

- React Native
- Node.js
- JDK
- Android Studio
- TypeScript
- Firebase

## Key Features

### User Registration and Login

- Users can easily register an account and log in to the app.
- Secure authentication is handled through Firebase Authentication.

### Client Features

- **Barber Selection:** Clients can browse through a list of registered barbers, view their profiles, and select a barber for their appointment.
- **Appointment Booking:** Clients can book appointments by selecting a date, time, and service. The available time slots are dynamically updated based on the barber's schedule.
- **Manage Appointments:** Clients have a dashboard where they can view all their upcoming and past appointments.
- **Cancel Appointments:** Clients have the option to cancel their appointments directly through the app.

### Barber Features

- **Registration and Login:** Barbers can register their profiles and log in to access their dashboard.
- **View Appointments:** Barbers can see all their scheduled appointments, including client details and service information.
- **Manage Appointments:** Barbers can approve or cancel appointments based on their availability and preferences.
- **Profile Management:** Barbers can update their profiles, including available services and working hours.

## Backend and Database

- **Firestore:** The database is managed using Firestore, a NoSQL database provided by Firebase, ensuring real-time data synchronization and offline capabilities.
- **Data Security:** Firestore's robust security rules ensure that data is securely stored and accessed only by authorized users.

## Additional Features

- **User-Friendly Interface:** The app boasts an intuitive and user-friendly interface, making navigation and usage seamless for both clients and barbers.
- **Responsive Design:** The application is designed to work on Android.
- **RSS Feed Integration:** The app also features a section for the latest news and articles from the barber industry, fetched from RSS feeds.

## Technical Stack

- **Frontend:** React Native for a cross-platform mobile application experience.
- **Backend:** Firebase Firestore for database management and Firebase Authentication for secure user authentication.
- **RSS Feed Integration:** The app fetches the latest news and articles from RSS feeds.

<!-- GETTING STARTED -->

## Getting Started

### Installing

To install and run react-native project on your local environment, you will need to:

1. Install Node.js and npm:

Download and install Node.js, which includes npm (Node.js package manager).

2. Install Java Development Kit (JDK):

Download and install the Java Development Kit (JDK), required for Android app development.

3. Install Android Studio:

Download and install Android Studio, which includes the Android SDK, emulators, and other necessary tools for Android app development.

4. Set up Development Environment:

Add paths to the Android SDK and other Android Studio tools to your system PATH variable.

If you need more information about this part, please follow the link: https://reactnative.dev/docs/environment-setup?guide=native.

5. Firebase setup

Create a Firebase project and configure Firestore and Authentication.

5. Clone the repository:

```sh
   git clone git@github.com:Becca1973/BarberApp.git
```

6. Navigate to the project directory:

```sh
   cd BarberApp
```

7. Start the application:

```sh
    npx react-native run-android
```

##Screenshots
![Main page Screen Shot][screenshot2]
![Main page Screen Shot][screenshot3]
![Main page Screen Shot][screenshot4]
![Main page Screen Shot][screenshot5]
![Main page Screen Shot][screenshot6]
![Main page Screen Shot][screenshot7]
![Main page Screen Shot][screenshot8]

<!-- MARKDOWN LINKS & IMAGES -->

[product-screenshot]: src/assets/screenshot1.png
[screenshot2]: src/assets/screenshot2.png
[screenshot3]: src/assets/screenshot3.png
[screenshot4]: src/assets/screenshot4.png
[screenshot5]: src/assets/screenshot5.png
[screenshot6]: src/assets/screenshot6.png
[screenshot7]: src/assets/screenshot7.png
[screenshot8]: src/assets/screenshot8.png
