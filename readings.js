google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(Ph_Chart);
google.charts.setOnLoadCallback(CO2_Chart);


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app-check.js";
import { getDatabase, query, ref, orderByKey, limitToLast, onChildAdded } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { getAuth} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBWRM4yc7JO4bK97yRfJisosVcWCFeUWFQ",
    authDomain: "capstone-project-iot.firebaseapp.com",
    databaseURL: "https://capstone-project-iot-default-rtdb.firebaseio.com",
    projectId: "capstone-project-iot",
    storageBucket: "capstone-project-iot.appspot.com",
    messagingSenderId: "55278853914",
    appId: "1:55278853914:web:f4b4cc9bd29fa8632f56a3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initiate the Database to access the documents
const db = getDatabase(app);
const auth = getAuth(app);



// Get the reference of the user document
const dbRef = ref(db,"/UsersData/AZ7gry0F88TucQpBbTwO9oSAA4i1/readings");

// convert epochtime to JavaScripte Date object
function epochToJsDate(epochTime){
  return new Date(epochTime*1000);
}

// convert time to human-readable format YYYY/MM/DD HH:MM:SS
function epochToDateTime(epochTime){
  var epochDate = new Date(epochToJsDate(epochTime));
  var dateTime = epochDate.getFullYear() + "/" +
    ("00" + (epochDate.getMonth() + 1)).slice(-2) + "/" +
    ("00" + epochDate.getDate()).slice(-2) + " " +
    ("00" + epochDate.getHours()).slice(-2) + ":" +
    ("00" + epochDate.getMinutes()).slice(-2) + ":" +
    ("00" + epochDate.getSeconds()).slice(-2);

  return dateTime;
}


var chartRange = 10;

function Ph_Chart() {

var options = {
  //title: 'Ph level',
    vAxis: {title: "pH level" },
    curveType: 'function',
    legend: { position: 'bottom' },
    animation: {duration: 300, easing: "out"}
};

var chart = new google.visualization.LineChart(document.getElementById('Ph_chart'));
var data = new google.visualization.DataTable();
data.addColumn("date","Date");
data.addColumn("number","pH level");
    
    var q = query(dbRef, orderByKey(), limitToLast(chartRange));
    onChildAdded(q, snapshot =>{
        var jsonData = snapshot.toJSON(); // example: {temperature: 25.02, humidity: 50.20, pressure: 1008.48, timestamp:1641317355}
        // Save values on variables
        var ph = jsonData["Ph level"];
        var timestamp = jsonData["timestamp"];
        
        var x = epochToJsDate(timestamp);
        var y = Number (ph);
        
        // Plot the values on the charts
        data.addRow([x, y]);
        
        if(data.getNumberOfRows() > chartRange){
            data.removeRow(0);
        }
        
        chart.draw(data, options);
    });
    
    onChildAdded(query(dbRef, orderByKey(),limitToLast(1)),snap=>{
        var ph = snap.toJSON()["Ph level"];
        SetPh(Number(ph).toFixed(2));
    });

}

function CO2_Chart() {

var options = {
  //title: 'CO2 level',
    vAxis: {title: "CO2 (ppm)" },
    curveType: 'function',
    legend: { position: 'bottom' },
    animation: {duration: 300, easing: "out"}
};

var chart = new google.visualization.LineChart(document.getElementById('CO2_chart'));
var data = new google.visualization.DataTable();
data.addColumn("date","Date");
data.addColumn("number","CO2 level");
    
    var q = query(dbRef, orderByKey(), limitToLast(chartRange));
    onChildAdded(q, snapshot =>{
        var jsonData = snapshot.toJSON(); // example: {temperature: 25.02, humidity: 50.20, pressure: 1008.48, timestamp:1641317355}
        // Save values on variables
        var co2 = jsonData["CO2 level"];
        var timestamp = jsonData["timestamp"];
        
        var x = epochToJsDate(timestamp);
        var y = Number (co2);
        // Plot the values on the charts
        data.addRow([x, y]);
        if(data.getNumberOfRows() > chartRange){
            data.removeRow(0);
        }
        
        chart.draw(data, options);
    });
    
    onChildAdded(query(dbRef, orderByKey(),limitToLast(1)),snap=>{
        var co2 = snap.toJSON()["CO2 level"];
        SetCO2(Number(co2).toFixed(2));
    });
}
let SetPh = (level) =>{
    document.getElementById("Ph_level").textContent = "pH level: " + level;
    document.getElementById("Ph_scale").getElementsByTagName("img")[0].style.transform = `translate(${-7.942857 * 10  * level}px)`;
}
let SetCO2 = (level) =>{
    document.getElementById("CO2_level").textContent = `${level}\nppm`;
}