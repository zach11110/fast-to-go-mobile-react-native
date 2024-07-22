// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getMessaging, getToken } from "firebase/messaging";

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCxOdvhDDw_Uj-HeMyhDs34drnvF5uPQEU",
//   authDomain: "fast-go-2023.firebaseapp.com",
//   projectId: "fast-go-2023",
//   storageBucket: "fast-go-2023.appspot.com",
//   messagingSenderId: "38206081103",
//   appId: "1:38206081103:web:3a74841b497ec689f7423a",
//   measurementId: "G-32C3GLPQLF",
// };

// const app = initializeApp(firebaseConfig);

// const auth = getAuth(app);

// export const getMessages = () => {
//   const messaging = getMessaging();

//   getToken(messaging, {
//     vapidKey:
//       "BORiP8GpgMdl7Ea6TGuq2ZkWGvl8Ex4wOWneCavsa08YWe3SDU9-YuKfr4hPzfmlcqMnaGWAzXji9THLq2MI_4E",
//   })
//     .then((currentToken) => {
//       if (currentToken) {
//         console.log(currentToken);
//       } else {
//         // Show permission request UI
//         console.log(
//           "No registration token available. Request permission to generate one."
//         );
//         // ...
//       }
//     })
//     .catch((err) => {
//       console.log("An error occurred while retrieving token. ", err);
//       // ...
//     });
// };

// export default app;
