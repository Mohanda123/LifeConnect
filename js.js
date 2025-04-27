// Sample hospital data
const hospitals = [
    { name: "Apollo Hospitals", email: "info@apollohospitals.com", city: "Chennai" },
    { name: "KMCH", email: "contact@kmchhospitals.com", city: "Coimbatore" },
    { name: "Madurai Meenakshi Mission Hospital", email: "info@mmhrc.in", city: "Madurai" }
];

// Load donors from local storage when page loads
document.addEventListener("DOMContentLoaded", loadDonors);

// Handle form submission (adding new donor)
document.getElementById("donorForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const bloodGroup = document.getElementById("bloodGroup").value;
    const organs = document.getElementById("organs").value;

    const donor = { name, age, bloodGroup, organs };
    
    // Save to local storage
    let donors = JSON.parse(localStorage.getItem("donors")) || [];
    donors.push(donor);
    localStorage.setItem("donors", JSON.stringify(donors));

    // Update UI
    displayDonors();
    
    // Clear form
    document.getElementById("donorForm").reset();
});

// Display donors in card format
function displayDonors() {
    const donorList = document.getElementById("donorList");
    donorList.innerHTML = ""; // Clear previous entries
    let donors = JSON.parse(localStorage.getItem("donors")) || [];

    donors.forEach((donor, index) => {
        const donorCard = document.createElement("div");
        donorCard.classList.add("donor-card");
        donorCard.innerHTML = `
            <strong>${donor.name}</strong><br>
            Age: ${donor.age} | Blood: ${donor.bloodGroup} <br>
            Organs: ${donor.organs} <br>
            <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        donorList.appendChild(donorCard);
    });

    // Add click event to all delete buttons
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach(button => {
        button.addEventListener("click", function () {
            let index = this.getAttribute("data-index");
            deleteDonor(index);
        });
    });
}

// Delete donor by index
function deleteDonor(index) {
    let donors = JSON.parse(localStorage.getItem("donors")) || [];
    
    if (confirm("Are you sure you want to delete this donor?")) {
        donors.splice(index, 1); // Remove 1 donor at that index
        localStorage.setItem("donors", JSON.stringify(donors)); // Save updated list
        displayDonors(); // Refresh list
    }
}

// Load donors when page loads
function loadDonors() {
    displayDonors();
}

// Notify hospitals via email
document.getElementById("notifyHospitals").addEventListener("click", function () {
    let donors = JSON.parse(localStorage.getItem("donors")) || [];

    if (donors.length === 0) {
        alert("No donors registered yet!");
        return;
    }

    hospitals.forEach(hospital => {
        let subject = encodeURIComponent("New Organ Donor Available");
        let body = encodeURIComponent(`Dear ${hospital.name},\n\nWe have a new organ donor:\n\nName: ${donors[0].name}\nAge: ${donors[0].age}\nBlood Group: ${donors[0].bloodGroup}\nOrgans: ${donors[0].organs}\n\nPlease contact us for more details.`);
        
        window.open(`mailto:${hospital.email}?subject=${subject}&body=${body}`);
    });

    alert("Hospitals have been notified!");
});
