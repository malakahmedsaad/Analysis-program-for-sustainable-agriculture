// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { initializeAppCheck, ReCaptchaV3Provider, getToken } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app-check.js";
import { getFirestore, collection, query, orderBy, getDocs, doc, getDoc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js';
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
//Initialize appCheck
const appCheck = initializeAppCheck(app, {
    provider: new ReCaptchaV3Provider('6LeqAzEjAAAAAFt0GCgYsA4l1W9bgYjvZdLIvZCo'),

    // Optional argument. If true, the SDK automatically refreshes App Check
    // tokens as needed.
    isTokenAutoRefreshEnabled: true
});


// Initiate Firestore to access the documents
const db = getFirestore(app);
// Get the reference of the collection Fish Types
const TypesOfFish = collection(db, 'Fish_Types');


// Insertion screen
// Add an event listener to the button Add new Species
document.getElementById("ANS").addEventListener("click",(event)=>{
    // Pops up a dialog to get the name of the new Species
    var n = prompt("Enter the name of the species");
    // Check the name is not empty
    if(n){
        // Add the new Specie document to the database
        addDoc(TypesOfFish,{"name": n});
        return;
    }
    alert("Enter a valid name");
});


// Add an event listener to any change in the database 
//const q = query(TypesOfFish,orderBy("name","asc"));
onSnapshot(query(TypesOfFish,orderBy("name","asc")),(snap)=>{
    // get a reference of the block species
    var species = document.getElementById("species");
    // Detecting the change in the last snapshot
    snap.docChanges().forEach((change)=>{
        if(change.type == "added"){
            // A new Species have been added
            let specie = createSpecie(change.doc);   // Create a new Specie block
            let col1 = createCol(change.doc,"Effect"); //Create a new column
            let col2 = createCol(change.doc,"Survival rate","number"); //Create a new column
            
            specie.appendChild(col1); //add the column
            specie.appendChild(col2); //add the coulumn
            
            let specieRef = species.appendChild(specie); // add the Specie block to the Species block
            
            // Get a reference to the subcollection Effect
            const effectRef = collection(db, 'Fish_Types',change.doc.id,"Effect");
            // catch when a change happens to the effect
            onSnapshot(effectRef,(snap)=>{
                    snap.docChanges().forEach((change2)=>{
                    let table = document.getElementById(change2.doc.get("type_id")).getElementsByClassName("Effect")[0];
                    let row = document.createElement("div");
                    let text = change2.doc.get("min") + " ~ " + change2.doc.get("max") + ": " + change2.doc.get("value");
                    row.textContent = text;
                        
                    //arrange the values
                    if(table.childElementCount > 0){
                        var count = table.childElementCount;
                        for(var i=0;i < count;i++){
                            if(parseFloat(text) < parseFloat(table.children[i].textContent)){
                                table.insertBefore(row,table.children[i]);
                                return;
                            }else{
                                if(i == count - 1){
                                    table.appendChild(row);
                                }
                            }
                        }
                    }else{
                        table.appendChild(row);
                    }
                });
            });

            // Get a reference to the subcollection Survival_rate
            const rateRef = collection(db, 'Fish_Types',change.doc.id,"Survival rate");
            // catch when a change happens to the survival rate
            onSnapshot(rateRef,(snap)=>{
                    snap.docChanges().forEach((change2)=>{
                    let table = document.getElementById(change2.doc.get("type_id")).getElementsByClassName("Survival rate")[0];
                    let row = document.createElement("div");
                    let text = change2.doc.get("min") + " ~ " + change2.doc.get("max") + ": " + change2.doc.get("value") + "%";
                    row.textContent = text;
                        
                    if(table.childElementCount > 0){
                        var count = table.childElementCount;
                        for(var i=0;i < count;i++){
                            if(parseFloat(text) < parseFloat(table.children[i].textContent)){
                                table.insertBefore(row,table.children[i]);
                                return;
                            }else{
                                if(i == count - 1){
                                    table.appendChild(row);
                                }
                            }
                        }
                    }else{
                        table.appendChild(row);
                    }
                });
            });

        }
        if(change.type == "modified"){
            // An existed Species have been modified 
            let specieRef = document.getElementById(change.doc.id); // get the Specie block that have the same id as the modified document
            
            
        }
        if(change.type == "removed"){
            // An existed Species have been removed
            let specieRef = document.getElementById(change.doc.id); // get the Specie block that have the same id as the deleted document
            species.removeChild(specieRef); // delete the Specie block
        }
    });
    
});


let createSpecie = (documentRef) =>{
    var specie = document.createElement("div");
    specie.setAttribute("id",documentRef.id); // changes the id of the Specie block to the id of the document in the database
    specie.setAttribute("class","specie"); // set the Specie block to the class s
    // Create a title block
    var title = document.createElement("div");
    title.setAttribute("class","title"); // set the title block to the class title
    title.textContent = "Species: " + documentRef.get("name"); // set the name of the title
    // Create a remove btn
    var remove = document.createElement("div");
    remove.setAttribute("class","remove") // set the button to the class btn
    remove.textContent = "Remove"; // set the name of the button
    // Add an event listener to create a right click menu
    specie.addEventListener("contextmenu",(event)=>{
        event.preventDefault();
        remove.style.top = event.pageY + "px";
        remove.style.left = event.pageX + "px";
        remove.style.width = "100px";
        remove.style.height = "40px";

    });
    // Add an event listener to disappear the remove button when the mouse is clicked away
    document.addEventListener("mousedown",(event)=>{
        remove.style.width = "0px";
        remove.style.height = "0px";

    });
    // Delete the document when a remove button is clicked
    remove.addEventListener("mousedown",(event)=>{
        deleteDoc(documentRef.ref);
    });
            
    
    specie.appendChild(remove) // add  to specie block
    specie.appendChild(title); // add the title to the Specie block
    return specie;
}

let createCol = (documentRef, ID, number=false) =>{
    // Create a title
    var title = document.createElement("div");
    title.className = "title";
    title.textContent = ID;
    // Create a column
    var col = document.createElement("div");
    col.setAttribute("class","col"); // set the column to the col class
    // Create a table
    var table = document.createElement("div");
    table.setAttribute("class","table " + ID); // set the table to the class table
    // Create a button to add a new range
    var btn = document.createElement("button");
    btn.setAttribute("class","btn") // set the button to the class btn
    btn.textContent = "+"; // set the name of the button
    // Create an input field to insert the minimum range
    var Input1 = document.createElement("input");
    Input1.setAttribute("type","number");
    Input1.setAttribute("placeholder","Enter the min");
    // Create an input field to insert the maximum range
    var Input2 = document.createElement("input");
    Input2.setAttribute("type","number");
    Input2.setAttribute("placeholder","Enter the max");
    // Create an input field to insert the name
    var Input3 = document.createElement("input");
    if(number){
        Input3.setAttribute("type", "number");
    }else{
        Input3.setAttribute("type", "option");
    }
    
    Input3.setAttribute("placeholder","Enter the " + ID);
    
    // Create an event listener when the button clicks to add a new range
    btn.addEventListener("click",(event)=>{
        // Check the input fields are not empty
        if(Input1.value && Input2.value && Input3.value){
            // Create a variable for min, max, and name values
            var min = Number(Input1.value);
            var max = Number(Input2.value);
            var value;
            if(number){
                value = Number(Input3.value);
            }else{
                value = Input3.value;
            }
            
            Input1.value = null;
            Input2.value = null;
            Input3.value = null;
            // Create a subcollection inside the document
            var subCollection = collection(TypesOfFish, documentRef.id, ID);
            addDoc(subCollection,{
            "min": min,
            "max": max,
            "type_name": documentRef.get("name"),
            "type_id": documentRef.id,
            "value": value
            });
            return;
        }
        alert("Enter the required Flieds");
    });
    col.appendChild(title);
    col.appendChild(table); // add table to column1
    col.appendChild(btn); // add button to column1
    col.appendChild(Input1);
    col.appendChild(Input2);
    col.appendChild(Input3);
    return col;
}


