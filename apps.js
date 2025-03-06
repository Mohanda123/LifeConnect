// Popup Functionality
var popupOverlay = document.querySelector(".popup-overlay");
var popupBox = document.querySelector(".popup-box");
var addPopupButton = document.getElementById("add-popup-button");
var cancelPopup = document.getElementById("cancel-popup");

addPopupButton.addEventListener("click", function () {
    popupOverlay.style.display = "block";
    popupBox.style.display = "block";
});

cancelPopup.addEventListener("click", function (event) {
    event.preventDefault();
    popupOverlay.style.display = "none";
    popupBox.style.display = "none";
});

// Form Elements
var container = document.querySelector(".container");
var addDetails = document.getElementById("add-details");
var nameInput = document.getElementById("name-input");
var emailInput = document.getElementById("email-input");
var phoneNumberInput = document.getElementById("phonenumber-input");
var bloodGroupInput = document.getElementById("bloodgroup-input");
var locationInput = document.getElementById("location-input");

// Function to Add User Details
addDetails.addEventListener("click", function (event) {
    event.preventDefault();

    var userData = {
        name: nameInput.value,
        email: emailInput.value,
        phone: phoneNumberInput.value,
        bloodGroup: bloodGroupInput.value,
        location: locationInput.value
    };

    saveToLocalStorage(userData);
    addUserCard(userData);
    popupOverlay.style.display = "none";
    popupBox.style.display = "none";

    // Clear Input Fields
    nameInput.value = "";
    emailInput.value = "";
    phoneNumberInput.value = "";
    bloodGroupInput.value = "";
    locationInput.value = "";
});

// Function to Display User Details
function addUserCard(userData) {
    var div = document.createElement("div");
    div.setAttribute("class", "register-container");
    div.setAttribute("data-bloodgroup", userData.bloodGroup.toUpperCase()); // Store blood group in a custom attribute

    div.innerHTML = `
        <h2>${userData.name}</h2>
        <h5>${userData.email}</h5>
        <h5>${userData.phone}</h5>
        <h2>${userData.bloodGroup}</h2>
        <h5>${userData.location}</h5>
        <button onclick="sendMessage(event, '${userData.phone}', '${userData.email}', '${userData.name}', '${userData.bloodGroup}', '${userData.location}')">Send</button>
        <button onclick="deleteDetails(event, '${userData.phone}')">Delete</button>
    `;
    container.append(div);
}

// Function to Filter Blood Group
function filterBloodGroup() {
    var input = document.getElementById("search-bar").value.toUpperCase().trim();
    var userCards = document.querySelectorAll(".register-container");

    userCards.forEach(card => {
        var bloodGroup = card.getAttribute("data-bloodgroup"); // Get blood group from data attribute
        if (bloodGroup && (bloodGroup === input || input === "")) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}



// Save Details to Local Storage
function saveToLocalStorage(userData) {
    var users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));
}

// Load Stored Details
function loadFromLocalStorage() {
    var users = JSON.parse(localStorage.getItem("users")) || [];
    users.forEach(user => addUserCard(user));
}

// Delete User Details
function deleteDetails(event, phone) {
    event.target.parentElement.remove();
    var users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.filter(user => user.phone !== phone);
    localStorage.setItem("users", JSON.stringify(users));
}

// Send WhatsApp & Email Messages
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

    // Email Message
    var emailSubject = `Urgent Blood Donation Request`;
    var emailBody = `Dear ${name},%0A%0A
    We have an urgent blood donation request for your blood group (${bloodGroup}).%0A
    Location: ${location}%0A%0A
    If you are available to donate, please contact us immediately.%0A%0A
    Thank you for your support!`;
    
    var emailLink = `mailto:${email}?subject=${emailSubject}&body=${emailBody}`;
    window.open(emailLink, '_blank');
}

// Load stored users when the page loads
window.onload = loadFromLocalStorage;
