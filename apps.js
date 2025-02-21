//view-register-person
var popupoverlay = document.querySelector(".popup-overlay")
var popupbox = document.querySelector(".popup-box")
var addpopupbutton =document.getElementById("add-popup-button")


addpopupbutton.addEventListener("click",function(){
    popupoverlay.style.display="block"
    popupbox.style.display="block"
})
var cancelpopup = document.getElementById("cancel-popup")
cancelpopup.addEventListener("click",function(event){
    event.preventDefault()
    popupoverlay.style.display="none"
    popupbox.style.display="none"
})
var container = document.querySelector(".container")
var adddetails = document.getElementById("add-details")
var nameinput = document. getElementById("name-input")
var emailinput = document. getElementById("email-input")
var phonenumberinput = document. getElementById("phonenumber-input")
var bloodgroupinput = document. getElementById("bloodgroup-input")
var locationinput = document.getElementById("location-input")

adddetails.addEventListener("click",function(event) {
    event.preventDefault()
    var div=document.createElement("div")
    div.setAttribute("class","register-container")
    div.innerHTML=`<h2>${nameinput.value}</h2>
        <h5>${emailinput.value}</h5>
        <h5>${phonenumberinput.value}</h5>
        <h2>${bloodgroupinput.value}</h2>
        <h5>${locationinput.value}</h5>
        <button>Send</button>
        <button onclick="deletedetails(event)">delete</button>`
    container.append(div)
    popupoverlay.style.display="none"
    popupbox.style.display="none"
})
function deletedetails(event){
    event.target.parentElement.remove()
}