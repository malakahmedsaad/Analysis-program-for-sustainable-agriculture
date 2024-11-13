document.getElementById("displayConsultation").addEventListener("click",(event)=>{
    document.getElementById("consultation").style.visibility = "visible";
});

document.getElementById("quit").addEventListener("click",(event)=>{
    document.getElementById("consultation").style.visibility = "hidden";
});