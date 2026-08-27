/* =====================================================
   LIFELINK FRONTEND LOGIC
   ===================================================== */


/* ================= PAGE ELEMENTS ================= */

const landingPage = document.getElementById("landingPage");
const loginPage = document.getElementById("loginPage");

const donorDashboard = document.getElementById("donorDashboard");
const receiverDashboard = document.getElementById("receiverDashboard");
const adminDashboard = document.getElementById("adminDashboard");

const toastBox = document.getElementById("toast");
const toastMessage = document.getElementById("toastMessage");


/* ================= SHOW LANDING ================= */

function showLanding() {

    landingPage.classList.remove("hidden");

    loginPage.classList.add("hidden");

    donorDashboard.classList.add("hidden");
    receiverDashboard.classList.add("hidden");
    adminDashboard.classList.add("hidden");
}


/* ================= LOGIN ================= */

function showLogin(defaultRole = null) {

    landingPage.classList.add("hidden");

    loginPage.classList.remove("hidden");

    if (defaultRole) {

        setTimeout(() => {
            selectRole(defaultRole);
        }, 200);
    }
}


/* ================= ROLE SELECTION ================= */

function selectRole(role) {

    landingPage.classList.add("hidden");
    loginPage.classList.add("hidden");

    donorDashboard.classList.add("hidden");
    receiverDashboard.classList.add("hidden");
    adminDashboard.classList.add("hidden");

    if (role === "donor") {

        donorDashboard.classList.remove("hidden");

        localStorage.setItem("lifelinkRole", "donor");

        toast("Welcome to your Donor Dashboard 🩸");

    }

    else if (role === "receiver") {

        receiverDashboard.classList.remove("hidden");

        localStorage.setItem("lifelinkRole", "receiver");

        toast("Welcome to LifeLink Receiver Dashboard 🚑");

    }

    else if (role === "admin") {

        adminDashboard.classList.remove("hidden");

        localStorage.setItem("lifelinkRole", "admin");

        toast("Welcome to LifeLink Admin Dashboard 🛡️");

    }
}


/* ================= LOGOUT ================= */

function logout() {

    closeAllSidebarMenus();

    donorDashboard.classList.add("hidden");
    receiverDashboard.classList.add("hidden");
    adminDashboard.classList.add("hidden");

    localStorage.removeItem("lifelinkRole");

    showLanding();

    toast("You have been logged out.");
}


/* =====================================================
   SIDEBAR KEBAB MENU (⋮)
   ===================================================== */

/*
   Each sidebar has:
   .sidebar-top              -> brand + toggle button
   .sidebar-menu-dropdown    -> the actual nav items (hidden by default)

   Clicking the ⋮ button opens/closes the dropdown that belongs
   to THAT sidebar only, and closes any other open dropdown.
*/

function toggleSidebarMenu(btn) {

    const sidebarTop = btn.closest(".sidebar-top");
    const dropdown = sidebarTop.nextElementSibling;

    const isOpen = dropdown.classList.contains("open");

    closeAllSidebarMenus();

    if (!isOpen) {
        dropdown.classList.add("open");
        btn.classList.add("active");
    }
}

function closeAllSidebarMenus() {

    document.querySelectorAll(".sidebar-menu-dropdown.open")
        .forEach(d => d.classList.remove("open"));

    document.querySelectorAll(".menu-toggle-btn.active")
        .forEach(b => b.classList.remove("active"));
}

/* close the dropdown when clicking outside it */

document.addEventListener("click", function (e) {

    const clickedInsideSidebar =
        e.target.closest(".sidebar-top") ||
        e.target.closest(".sidebar-menu-dropdown");

    if (!clickedInsideSidebar) {
        closeAllSidebarMenus();
    }
});

/* highlight the clicked nav item, close the dropdown, and
   give feedback for features that don't have a page yet */

document.addEventListener("click", function (e) {

    const menuItem = e.target.closest(".sidebar-menu-dropdown .menu");

    if (!menuItem) {
        return;
    }

    const dropdown = menuItem.closest(".sidebar-menu-dropdown");

    dropdown.querySelectorAll(".menu")
        .forEach(m => m.classList.remove("active"));

    menuItem.classList.add("active");

    closeAllSidebarMenus();

    /* the label text of the button, e.g. "Blood Requests" */
    const labelEl = menuItem.querySelector("span:last-child");
    const label = labelEl ? labelEl.innerText.trim() : menuItem.innerText.trim();

    /* "Dashboard" is the only page actually built right now —
       everything else doesn't have content wired up yet, so we
       tell the user clearly instead of clicking into nothing. */
    if (label !== "Dashboard") {
        toast(`🚧 ${label} isn't built yet — coming soon`);
    }
});


/* ================= DONOR AVAILABILITY ================= */

function changeAvailability() {

    const toggle =
        document.getElementById("availabilityToggle");

    const status =
        document.getElementById("donorStatusText");

    if (toggle.checked) {

        status.innerHTML =
            '<span class="status-dot"></span> You are Available';

        localStorage.setItem(
            "donorAvailability",
            "available"
        );

        toast(
            "You are now available for blood requests."
        );

    } else {

        status.innerHTML =
            '<span class="status-dot" style="background:#aaa"></span> You are Not Available';

        localStorage.setItem(
            "donorAvailability",
            "unavailable"
        );

        toast(
            "You are now unavailable for requests."
        );
    }
}


/* ================= ACCEPT REQUEST ================= */

function acceptRequest() {

    toast(
        "Blood request accepted! Receiver has been notified ❤️"
    );

    const requestCard =
        document.querySelector(".emergency-request");

    if (requestCard) {

        const badge =
            requestCard.querySelector(".critical-badge");

        if (badge) {

            badge.innerText = "ACCEPTED";

            badge.style.background = "#dcfce7";
            badge.style.color = "#15803d";
        }
    }
}


/* ================= DECLINE REQUEST ================= */

function declineRequest() {

    toast(
        "Request declined. Looking for another donor."
    );

}


/* ================= DONOR LOCATION ================= */

function getLocation() {

    if (!navigator.geolocation) {

        toast(
            "Geolocation is not supported by this browser."
        );

        return;
    }


    toast("Requesting your current location...");


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            document.getElementById(
                "locationText"
            ).innerText =
                `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;


            localStorage.setItem(
                "donorLatitude",
                latitude
            );

            localStorage.setItem(
                "donorLongitude",
                longitude
            );


            toast(
                "Location updated successfully 📍"
            );
        },


        function() {

            toast(
                "Unable to access your location."
            );

        }
    );
}


/* ================= RECEIVER LOCATION ================= */

function getReceiverLocation() {

    if (!navigator.geolocation) {

        toast(
            "Geolocation is not supported."
        );

        return;
    }


    toast("Getting your current location...");


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude =
                position.coords.latitude;

            const longitude =
                position.coords.longitude;


            document.getElementById(
                "receiverLocation"
            ).innerText =
                `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;


            localStorage.setItem(
                "receiverLatitude",
                latitude
            );

            localStorage.setItem(
                "receiverLongitude",
                longitude
            );


            toast(
                "Receiver location updated 📍"
            );
        },


        function() {

            toast(
                "Location permission denied."
            );

        }
    );
}


/* =====================================================
   RECEIVER → CREATE BLOOD REQUEST
   ===================================================== */

function createBloodRequest() {

    const bloodGroup =
        document.getElementById(
            "receiverBloodGroup"
        ).value;


    const units =
        document.getElementById(
            "receiverUnits"
        ).value;


    const hospital =
        document.getElementById(
            "receiverHospital"
        ).value;


    const urgency =
        document.getElementById(
            "receiverUrgency"
        ).value;


    /* VALIDATION */

    if (!bloodGroup) {

        toast(
            "Please select a blood group."
        );

        return;
    }


    if (!hospital.trim()) {

        toast(
            "Please enter the hospital name."
        );

        return;
    }


    /* CREATE REQUEST OBJECT */

    const request = {

        id:
            "LL" +
            Math.floor(
                1000 +
                Math.random() * 9000
            ),

        bloodGroup:
            bloodGroup,

        units:
            Number(units),

        hospital:
            hospital,

        urgency:
            urgency,

        status:
            "Active",

        createdAt:
            new Date().toISOString()

    };


    /* SAVE REQUEST */

    localStorage.setItem(
        "latestBloodRequest",
        JSON.stringify(request)
    );


    /* SHOW MATCHES */

    showDonorMatches(
        bloodGroup
    );


    toast(
        "Emergency request created successfully 🚨"
    );


    /* UPDATE ADMIN */

    updateAdminEmergency();
}


/* =====================================================
   SMART DONOR MATCHING
   ===================================================== */

function showDonorMatches(bloodGroup) {

    const resultContainer =
        document.getElementById(
            "donorResults"
        );


    const donors = [

        {
            name: "Arun Kumar",
            initials: "AK",
            blood: "O+",
            distance: "2.4 km",
            eta: "7 min",
            score: 96
        },

        {
            name: "Ravi Shankar",
            initials: "RS",
            blood: "O+",
            distance: "3.1 km",
            eta: "9 min",
            score: 91
        },

        {
            name: "Vijay Prakash",
            initials: "VP",
            blood: "O+",
            distance: "4.8 km",
            eta: "12 min",
            score: 87
        },

        {
            name: "Suresh Kumar",
            initials: "SK",
            blood: "O+",
            distance: "7.2 km",
            eta: "16 min",
            score: 82
        }

    ];


    /* In the real Firebase version,
       this list will come from Firestore. */


    const compatibleDonors =
        donors.filter(
            donor =>
                donor.blood === bloodGroup
        );


    document.getElementById(
        "matchCount"
    ).innerText =
        `${compatibleDonors.length} Matches`;


    if (compatibleDonors.length === 0) {

        resultContainer.innerHTML = `

            <div class="empty-state">

                <div>😔</div>

                <h3>
                    No nearby donors found
                </h3>

                <p>
                    Try expanding the search radius.
                </p>

            </div>

        `;

        return;
    }


    resultContainer.innerHTML =
        compatibleDonors.map(

            donor => `

                <div class="donor-result">

                    <div class="donor-result-avatar">
                        ${donor.initials}
                    </div>

                    <div class="donor-result-info">

                        <strong>
                            ${donor.name}
                        </strong>

                        <span>
                            🩸 ${donor.blood}
                            &nbsp; • &nbsp;
                            📍 ${donor.distance}
                            &nbsp; • &nbsp;
                            ETA ${donor.eta}
                        </span>

                    </div>

                    <div class="match-percentage">
                        ${donor.score}% Match
                    </div>

                    <button
                        class="contact-btn"
                        onclick="sendDonorRequest('${donor.name}')">

                        Request

                    </button>

                </div>

            `

        ).join("");
}


/* =====================================================
   SEND REQUEST TO DONOR
   ===================================================== */

function sendDonorRequest(donorName) {

    toast(
        `Emergency request sent to ${donorName} 🚨`
    );


    localStorage.setItem(
        "requestSentTo",
        donorName
    );
}


/* ================= ADMIN EMERGENCY ================= */

function createAdminEmergency() {

    const bloodGroup =
        prompt(
            "Enter required blood group:",
            "O+"
        );


    if (!bloodGroup) {

        return;
    }


    toast(
        `Emergency request created for ${bloodGroup} 🚨`
    );


    updateAdminEmergency();
}


/* ================= UPDATE ADMIN ================= */

function updateAdminEmergency() {

    const adminCount =
        document.getElementById(
            "adminEmergencies"
        );


    if (!adminCount) {

        return;
    }


    let current =
        parseInt(
            adminCount.innerText
        );


    current++;


    adminCount.innerText =
        current;
}


/* =====================================================
   TOAST MESSAGE
   ===================================================== */

function toast(message) {

    toastMessage.innerText =
        message;

    toastBox.classList.add("show");


    setTimeout(() => {

        toastBox.classList.remove(
            "show"
        );

    }, 3000);
}


/* =====================================================
   RESTORE SESSION
   ===================================================== */

window.addEventListener(
    "load",
    function() {

        const role =
            localStorage.getItem(
                "lifelinkRole"
            );


        if (role === "donor") {

            selectRole("donor");

        }

        else if (role === "receiver") {

            selectRole("receiver");

        }

        else if (role === "admin") {

            selectRole("admin");

        }

        else {

            showLanding();

        }

    }
);
