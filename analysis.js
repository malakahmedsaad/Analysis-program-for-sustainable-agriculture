google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(Analysis_Chart);


// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app-check.js";
import { getDatabase, query, ref, get, orderByKey, limitToLast, onChildAdded } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js';
import { getFirestore, query as fireQuery, collection, getCountFromServer, onSnapshot, getDocs, where, limit, orderBy, queryEqual } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
import { getAuth} from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js';
// TODO: Add SDKs for Firebase products that you want to use
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


var Output = document.getElementById("OutputText");

// Initiate the Database to access the documents
const db = getDatabase(app);
const fs = getFirestore(app);
const auth = getAuth(app);

const TypesOfFish = collection(fs,"Fish_Types");
const readings = ref(db,"/UsersData/AZ7gry0F88TucQpBbTwO9oSAA4i1/readings");

//var currentPh = 0;
onChildAdded(query(readings, orderByKey(),limitToLast(1)),current=>{
var json = current.toJSON();
SetPh(json["Ph level"].toFixed(2));
//currentPh = json["Ph level"];
});


function Analysis_Chart() {
    var options = {
        vAxis: {title: 'Survival rate (%)', viewWindow: {max: 100, min: 0}},
        hAxis: {title: 'Fish species'},
        seriesType: 'bars',
        legend: "none",
        animation: {duration: 300, easing: "out"}
    };
    
    var chart = new google.visualization.ComboChart(document.getElementById('Analysis_chart'));
    var data = new google.visualization.DataTable();
    data.addColumn("string","Specie");
    data.addColumn("number","Survival rate");
    data.addColumn({type: "string", role: "style"});
    
    onSnapshot(fireQuery(TypesOfFish, orderBy("name")),snap=>{
        snap.docChanges().forEach((change)=>{
            if(change.type == "added"){
                var name = change.doc.get("name");
                var index = data.addRow([name.toString(),  0, "#fa1058"]);
                chart.draw(data, options);
                
                onChildAdded(query(readings,orderByKey(),limitToLast(1)),(current)=>{
                    var ph = Number(current.toJSON()["Ph level"]);
                    
                    Output.textContent = "";
                    
                    var rateRef = collection(TypesOfFish,change.doc.id,"Survival rate");
                    var effectRef = collection(TypesOfFish,change.doc.id,"Effect");
                    
                    
                    var q3 = fireQuery(effectRef,where("min", "<", ph),orderBy("min","desc"),limit(1));
                    var q4 = fireQuery(effectRef,where("max", ">", ph),limit(1));
                    
                    getDocs(q3).then(snap3=>{
                        getDocs(q4).then(snap4=>{
                            if(snap3.docs[0].id == snap4.docs[0].id){
                                var d = snap3.docs[0];
                                data.setCell(index, 2,  getColor(d.get("value")));
                                chart.draw(data, options);
                                Output.textContent += `Specie ${d.get("type_name")} is ${d.get("value")}`;
                                if((index+1) < data.getNumberOfRows()){
                                    Output.textContent += ", ";
                                }else{
                                    Output.textContent += ".";
                                }
                            } 
                        });
                    });
                    
                    var q1 = fireQuery(rateRef,where("min", "<", ph),orderBy("min","desc"),limit(1));
                    var q2 = fireQuery(rateRef,where("max", ">", ph),limit(1));
                    
                    getDocs(q1).then(snap1=>{
                        getDocs(q2).then(snap2=>{
                            if(snap1.docs[0].id == snap2.docs[0].id){
                                var value2 = snap2.docs[0].get("value");
                                data.setCell(index, 1,  Number(value2));
                                chart.draw(data, options);
                            }
                        });
                    });
                });
            }
        });
    });
}

const getColor = (text) =>{
    if(text == "Acidic death point" || text == "acidic death point"){
        return "#D82E3F";
    }else if(text == "No reproduction" || text == "no reproduction"){
        //return "#3581D8";
        return "#808080";
    }else if(text == "Slow growth" || text == "slow growth"){
        return "#FFE135";
    }else if(text == "Optimal growth" || text == "optimal growth"){
        return "#28CC2D";
    }else if(text == "Alkaline death point" || text == "alkaline death point"){
        return "#185abc";
    }
}

const SetPh = (level) =>{
    document.getElementById("Ph_level").textContent = "pH level: " + level;
}