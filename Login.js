// Import the functions you need from the SDKs you need
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
    import { getDatabase, query, ref } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
    import { getAuth, signInWithEmailAndPassword} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyDCEU45w3pyOJMQqmUpOsEnlzS7YPtInak",
    authDomain: "team10320-iot-project.firebaseapp.com",
    databaseURL: "https://team10320-iot-project-default-rtdb.firebaseio.com",
    projectId: "team10320-iot-project",
    storageBucket: "team10320-iot-project.appspot.com",
    messagingSenderId: "148042039087",
    appId: "1:148042039087:web:3b088d91951f26860fabda"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

document.getElementById("submit").addEventListener("click",(event)=>{
    event.preventDefault();
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    if(email && password){
        signInWithEmailAndPassword(auth,email,password).then((user)=>{
            alert(`Hello ${user.user.displayName} \n Login has been successful`);
        }).catch((error)=>{
            if(error.code == AuthErrorCodes.INVALID_PASSWORD){
                alert("Invalid password\nplease try again !");
            }else{
                alert("Invalid input\nplease try again !")
            }
            
        });
    }else{alert("Please enter your email address and password");}
});
