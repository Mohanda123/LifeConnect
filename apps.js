var popupoverlay = document.querySelector(".popup-overlay")
var popupbox = document.querySelector(".popup-box")
var addpopupbutton = document.getElementById("add-popup-button")

addpopupbutton.addEventListener("click", function () {
    popupoverlay.style.display = "block"
    popupbox.style.display = "block"
})

var cancelpopup = document.getElementById("cancel-popup")
cancelpopup.addEventListener("click", function (event) {
    event.preventDefault()
    popupoverlay.style.display = "none"
    popupbox.style.display = "none"
})

var container = document.querySelector(".container")
var adddetails = document.getElementById("add-details")
var nameinput = document.getElementById("name-input")
var emailinput = document.getElementById("email-input")
var phonenumberinput = document.getElementById("phonenumber-input")
var bloodgroupinput = document.getElementById("bloodgroup-input")
var locationinput = document.getElementById("location-input")

// Function to add new details
adddetails.addEventListener("click", function (event) {
    event.preventDefault()

    var userData = {
        name: nameinput.value,
        email: emailinput.value,
        phone: phonenumberinput.value,
        bloodGroup: bloodgroupinput.value,
        location: locationinput.value
    }

    saveToLocalStorage(userData)
    addUserCard(userData)
    popupoverlay.style.display = "none"
    popupbox.style.display = "none"

    // Clear input fields after adding
    nameinput.value = ""
    emailinput.value = ""
    phonenumberinput.value = ""
    bloodgroupinput.value = ""
    locationinput.value = ""
})

// Function to display user details
function addUserCard(userData) {
    var div = document.createElement("div")
    div.setAttribute("class", "register-container")
    div.innerHTML = `<h2>${userData.name}</h2>
        <h5>${userData.email}</h5>
        <h5>${userData.phone}</h5>
        <h2>${userData.bloodGroup}</h2>
        <h5>${userData.location}</h5>
        <button>Send</button>
        <button onclick="deleteDetails(event, '${userData.phone}')">Delete</button>`
    container.append(div)
}

// Function to save details in Local Storage
function saveToLocalStorage(userData) {
    var users = JSON.parse(localStorage.getItem("users")) || []
    users.push(userData)
    localStorage.setItem("users", JSON.stringify(users))
}

// Function to load stored details on page load
function loadFromLocalStorage() {
    var users = JSON.parse(localStorage.getItem("users")) || []
    users.forEach(user => addUserCard(user))
}

// Function to delete details from Local Storage
function deleteDetails(event, phone) {
    event.target.parentElement.remove()
    var users = JSON.parse(localStorage.getItem("users")) || []
    users = users.filter(user => user.phone !== phone)
    localStorage.setItem("users", JSON.stringify(users))
}
function sendMessage(event, phone, email, name, bloodGroup, location) {
    event.preventDefault();

    // WhatsApp Message
    var whatsappMessage = `Hello ${name},%0A
    We have an urgent blood request for your group (${bloodGroup}).%0A
    Location: ${location}%0A
    Please consider donating. Contact us for more details.%0A
    Thank you!`;
    
    var whatsappLink = `https://wa.me/${phone}?text=${whatsappMessage}`;
    window.open(whatsappLink, '_blank');

    // Email Sending using mailto:
    var emailSubject = `Urgent Blood Donation Request`;
    var emailBody = `Dear ${name},%0A%0A
    We have an urgent blood donation request for your blood group (${bloodGroup}).%0A
    Location: ${location}%0A%0A
    If you are available to donate, please contact us immediately.%0A%0A
    Thank you for your support!`;
    
    var emailLink = `mailto:${email}?subject=${emailSubject}&body=${emailBody}`;
    window.open(emailLink, '_blank');
}

// Modify the function to include the sendMessage feature
function addUserCard(userData) {
    var div = document.createElement("div");
    div.setAttribute("class", "register-container");
    div.innerHTML = `<h2>${userData.name}</h2>
        <h5>${userData.email}</h5>
        <h5>${userData.phone}</h5>
        <h2>${userData.bloodGroup}</h2>
        <h5>${userData.location}</h5>
        <button onclick="sendMessage(event, '${userData.phone}', '${userData.email}', '${userData.name}', '${userData.bloodGroup}', '${userData.location}')">Send</button>
        <button onclick="deleteDetails(event, '${userData.phone}')">Delete</button>`;
    container.append(div);
}

// Load stored users when the page loads
window.onload = loadFromLocalStorage
