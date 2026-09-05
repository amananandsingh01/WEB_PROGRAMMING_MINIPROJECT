/* =========================================
   Campus Skill Exchange - JavaScript
   ========================================= */

// Backend API base URL
const API_BASE = "http://localhost:5000/api";

// Show a simple message
function showMessage(message, type = "success") {
    const alertBox = document.createElement("div");

    alertBox.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertBox.style.zIndex = "9999";

    alertBox.innerText = message;

    document.body.appendChild(alertBox);

    setTimeout(() => {
        alertBox.remove();
    }, 2500);
}

async function handleRegistration(event) {

    event.preventDefault();

    const form = document.getElementById("registerForm");

    const username = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const department = document.getElementById("department").value;
    const year = document.getElementById("year").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const confirmPasswordInput = document.getElementById("confirmPassword");

    // Basic HTML validation
    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
    }

    // Password matching
    if (password !== confirmPassword) {
        confirmPasswordInput.setCustomValidity("Passwords do not match");
        form.classList.add("was-validated");
        return;
    }

    confirmPasswordInput.setCustomValidity("");

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password, department, year })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.error || "Registration failed. Please try again.", "danger");
            return;
        }

        showMessage("Account created successfully!", "success");

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1000);

    } catch (err) {
        showMessage("Could not connect to server. Make sure the backend is running.", "danger");
    }
}


// Basic form validation
function validateForm(formId) {
    const form = document.getElementById(formId);

    if (!form) return false;

    if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return false;
    }

    return true;
}

// Login — calls the backend API and stores the JWT token
async function handleLogin(event) {
    event.preventDefault();

    if (!validateForm("loginForm")) {
        return;
    }

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.error || "Login failed. Check your credentials.", "danger");
            return;
        }

        // Store the JWT token and basic user info
        localStorage.setItem("campusskill_token", data.token);
        localStorage.setItem("campusskill_user", JSON.stringify(data.user));

        showMessage("Login successful!");

        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (err) {
        showMessage("Could not connect to server. Make sure the backend is running.", "danger");
    }
}


// Logout — clears the JWT and redirects to home
function logout() {
    localStorage.removeItem("campusskill_token");
    localStorage.removeItem("campusskill_user");

    showMessage("Logged out successfully.");

    setTimeout(() => {
        window.location.href = "index.html";
    }, 700);
}


/* =========================================
   Shared demo data
   (in a real app this would come from a
   backend/database)
   ========================================= */

const STUDENTS = [
    {
        id: "ananya",
        name: "Ananya Sharma",
        initials: "AS",
        department: "Computer Science",
        year: "2nd Year",
        rating: 4.9,
        bio: "I love building web apps and helping beginners get comfortable with React and JavaScript. Happy to pair-program or explain concepts step by step.",
        teach: ["React", "JavaScript", "Web Development"],
        learn: ["DevOps", "Cloud"],
        students: 24,
        hours: 128
    },
    {
        id: "rahul",
        name: "Rahul Kumar",
        initials: "RK",
        department: "Information Technology",
        year: "3rd Year",
        rating: 4.8,
        bio: "Machine learning enthusiast who enjoys turning messy data into useful models. I can help with Python fundamentals all the way to ML pipelines.",
        teach: ["Python", "Machine Learning", "Data Analysis"],
        learn: ["Web Development", "Frontend"],
        students: 18,
        hours: 95
    },
    {
        id: "priya",
        name: "Priya Mehta",
        initials: "PM",
        department: "Design",
        year: "2nd Year",
        rating: 4.9,
        bio: "Product designer who's passionate about clean, usable interfaces. I teach Figma workflows and core UI/UX principles from scratch.",
        teach: ["UI/UX", "Figma", "Design Principles"],
        learn: ["Frontend", "React"],
        students: 21,
        hours: 112
    },
    {
        id: "vikram",
        name: "Vikram Kumar",
        initials: "VK",
        department: "Computer Science",
        year: "1st Year",
        rating: 4.7,
        bio: "First-year student sharpening my fundamentals. I enjoy explaining DSA problems and can also help newcomers get started with Python and C++.",
        teach: ["Python", "C++", "DSA"],
        learn: ["Web Development", "Databases"],
        students: 12,
        hours: 54
    },
    {
        id: "sarah",
        name: "Sarah Khan",
        initials: "SK",
        department: "Electronics",
        year: "4th Year",
        rating: 5.0,
        bio: "Embedded systems tutor with hands-on IoT project experience. I can guide you through Arduino projects from wiring to code.",
        teach: ["Arduino", "Embedded Systems", "IoT"],
        learn: ["AI/ML", "Python"],
        students: 32,
        hours: 187
    },
    {
        id: "disha",
        name: "Disha Jain",
        initials: "DJ",
        department: "Mechanical",
        year: "3rd Year",
        rating: 4.8,
        bio: "CAD and 3D modeling tutor who enjoys bridging mechanical design with software skills. Also learning to code on the side!",
        teach: ["CAD", "SolidWorks", "3D Modeling"],
        learn: ["Python", "Robotics"],
        students: 19,
        hours: 86
    }
];


/* =========================================
   Search / Find Students page
   ========================================= */

function getStudentCardHTML(student) {
    return `
        <div class="student-item">
            <div class="student-avatar">${student.initials}</div>
            <div class="student-info">
                <h3>${student.name}</h3>
                <p>${student.department} &middot; ${student.year} &middot; ⭐ ${student.rating}</p>
                <div class="mini-skills">
                    ${student.teach.map(skill => `<span>${skill}</span>`).join("")}
                </div>
            </div>
            <div class="quick-actions" style="flex-direction: row; gap: 8px;">
                <a href="student-profile.html?id=${student.id}" class="outline-btn" style="text-decoration:none; text-align:center;">View Profile</a>
            </div>
        </div>
    `;
}

function renderStudentResults(list) {
    const container = document.getElementById("studentResults");
    const emptyState = document.getElementById("noResults");

    if (!container) return;

    if (list.length === 0) {
        container.innerHTML = "";
        if (emptyState) emptyState.style.display = "block";
        return;
    }

    if (emptyState) emptyState.style.display = "none";

    container.innerHTML = list.map(getStudentCardHTML).join("");
}

function filterStudents() {
    const searchInput = document.getElementById("studentSearch");
    const deptFilter = document.getElementById("departmentFilter");

    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const department = deptFilter ? deptFilter.value : "all";

    const filtered = STUDENTS.filter(student => {
        const matchesQuery =
            query === "" ||
            student.name.toLowerCase().includes(query) ||
            student.teach.some(skill => skill.toLowerCase().includes(query));

        const matchesDept =
            department === "all" || student.department === department;

        return matchesQuery && matchesDept;
    });

    renderStudentResults(filtered);
}

function initSearchPage() {
    if (!document.getElementById("studentResults")) return;
    renderStudentResults(STUDENTS);
}


/* =========================================
   Student profile page
   ========================================= */

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

function loadStudentProfile() {
    const wrapper = document.getElementById("studentProfileContent");
    if (!wrapper) return;

    const id = getQueryParam("id") || "ananya";
    const student = STUDENTS.find(s => s.id === id) || STUDENTS[0];

    document.title = `${student.name} - CampusSkill`;

    wrapper.innerHTML = `
        <div class="profile-hero">
            <div class="profile-hero-avatar">${student.initials}</div>
            <div>
                <h1>${student.name}</h1>
                <p>${student.department} &middot; ${student.year}</p>
                <p>⭐ ${student.rating} &middot; ${student.students} students taught &middot; ${student.hours} hours</p>
            </div>
        </div>

        <div class="dashboard-card">
            <h2>About</h2>
            <p>${student.bio}</p>
        </div>

        <div class="dashboard-card">
            <h2>Can Teach</h2>
            <div class="skill-tags">
                ${student.teach.map(skill => `<span>${skill}</span>`).join("")}
            </div>
        </div>

        <div class="dashboard-card">
            <h2>Wants to Learn</h2>
            <div class="skill-tags">
                ${student.learn.map(skill => `<span>${skill}</span>`).join("")}
            </div>
        </div>
    `;

    const requestBtn = document.getElementById("sendRequestBtn");
    if (requestBtn) {
        requestBtn.onclick = () => sendCollaborationRequest(student.name);
    }
}


/* =========================================
   Requests page
   (stored in localStorage so accept /
   reject actions persist between visits)
   ========================================= */

const REQUESTS_KEY = "campusskill_requests";

const DEFAULT_REQUESTS = {
    incoming: [
        { id: "r1", name: "Ananya Sharma", initials: "AS", note: "Wants to learn JavaScript from you", status: "pending" },
        { id: "r2", name: "Vikram Kumar", initials: "VK", note: "Can teach you Python", status: "pending" },
        { id: "r3", name: "Sarah Khan", initials: "SK", note: "Wants to learn Web Development from you", status: "accepted" }
    ],
    outgoing: [
        { id: "r4", name: "Priya Mehta", initials: "PM", note: "You asked to learn UI/UX", status: "pending" },
        { id: "r5", name: "Rahul Kumar", initials: "RK", note: "You asked to learn Machine Learning", status: "rejected" }
    ]
};

function loadRequests() {
    const stored = localStorage.getItem(REQUESTS_KEY);

    if (!stored) {
        localStorage.setItem(REQUESTS_KEY, JSON.stringify(DEFAULT_REQUESTS));
        return JSON.parse(JSON.stringify(DEFAULT_REQUESTS));
    }

    try {
        return JSON.parse(stored);
    } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_REQUESTS));
    }
}

function saveRequests(data) {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(data));
}

function sendCollaborationRequest(name) {
    const data = loadRequests();

    data.outgoing.unshift({
        id: "r" + Date.now(),
        name: name,
        initials: name.split(" ").map(n => n[0]).join(""),
        note: "You sent a collaboration request",
        status: "pending"
    });

    saveRequests(data);
    showMessage(`Request sent to ${name}!`);
}

function getStatusLabel(status) {
    if (status === "accepted") return "Accepted";
    if (status === "rejected") return "Rejected";
    return "Pending";
}

function getRequestRowHTML(request, type) {
    let actions = "";

    if (request.status === "pending" && type === "incoming") {
        actions = `
            <button class="rec-btn" onclick="respondToRequest('${type}', '${request.id}', 'accepted')">Accept</button>
            <button class="outline-btn" onclick="respondToRequest('${type}', '${request.id}', 'rejected')">Decline</button>
        `;
    } else if (request.status === "pending" && type === "outgoing") {
        actions = `<button class="outline-btn" onclick="respondToRequest('${type}', '${request.id}', 'rejected')">Cancel</button>`;
    }

    return `
        <div class="request-preview">
            <div class="small-avatar">${request.initials}</div>
            <div style="flex:1;">
                <h3>${request.name}</h3>
                <p>${request.note}</p>
            </div>
            <span class="status status-${request.status}">${getStatusLabel(request.status)}</span>
            <div class="quick-actions" style="flex-direction: row; gap: 8px; width: auto;">
                ${actions}
            </div>
        </div>
    `;
}

function renderRequests() {
    const data = loadRequests();

    const incomingEl = document.getElementById("incomingRequests");
    const outgoingEl = document.getElementById("outgoingRequests");

    if (incomingEl) {
        incomingEl.innerHTML = data.incoming.length
            ? data.incoming.map(r => getRequestRowHTML(r, "incoming")).join("")
            : "<p class=\"text-muted\">No incoming requests yet.</p>";
    }

    if (outgoingEl) {
        outgoingEl.innerHTML = data.outgoing.length
            ? data.outgoing.map(r => getRequestRowHTML(r, "outgoing")).join("")
            : "<p class=\"text-muted\">You haven't sent any requests yet.</p>";
    }
}

function respondToRequest(type, id, newStatus) {
    const data = loadRequests();
    const list = type === "incoming" ? data.incoming : data.outgoing;
    const request = list.find(r => r.id === id);

    if (request) {
        request.status = newStatus;
        saveRequests(data);
        renderRequests();

        if (newStatus === "accepted") {
            showMessage(`You're now connected with ${request.name}!`);
        } else if (type === "outgoing") {
            showMessage("Request cancelled.");
        } else {
            showMessage("Request declined.");
        }
    }
}

function initRequestsPage() {
    if (!document.getElementById("incomingRequests")) return;
    renderRequests();
}


/* =========================================
   Profile editor page — API-driven
   ========================================= */

// Holds the user's current skills in memory while on the profile page
let __profileSkills = { offering: [], learning: [] };

function renderTagList(containerId, skills, type) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!skills.length) {
        container.innerHTML = "<span style=\"color:#64748b\">None added yet.</span>";
        return;
    }

    container.innerHTML = skills.map(skill => `
        <span>
            ${skill.name}
            <button type="button" class="tag-remove"
                onclick="removeSkill('${containerId}', ${skill.id}, '${type}')">
                &times;
            </button>
        </span>
    `).join("");
}

async function initProfilePage() {
    const form = document.getElementById("profileForm");
    if (!form) return;

    const token = localStorage.getItem("campusskill_token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        // Load profile info
        const res = await fetch(`${API_BASE}/profile/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) {
            window.location.href = "login.html";
            return;
        }

        const user = await res.json();

        document.getElementById("profileName").value       = user.username   || "";
        document.getElementById("profileDepartment").value = user.department || "Computer Science";
        document.getElementById("profileYear").value       = user.year       || "1st Year";
        document.getElementById("profileBio").value        = user.bio        || "";

        const avatarEl = document.getElementById("profileAvatarLetters");
        if (avatarEl) {
            avatarEl.textContent = (user.username || "U")
                .split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
        }

        // Load skills
        const skillsRes = await fetch(`${API_BASE}/profile/skills`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const skillsData = await skillsRes.json();
        __profileSkills = skillsData;

        renderTagList("teachTags", skillsData.offering, "offering");
        renderTagList("learnTags", skillsData.learning, "learning");

    } catch (err) {
        showMessage("Could not load profile. Is the server running?", "danger");
    }

    form.addEventListener("submit", handleProfileSave);
}

async function addSkill(field) {
    const inputId = field === "teach" ? "newTeachSkill" : "newLearnSkill";
    const input   = document.getElementById(inputId);
    if (!input || !input.value.trim()) return;

    const skillName = input.value.trim();
    const type      = field === "teach" ? "offering" : "learning";
    const token     = localStorage.getItem("campusskill_token");

    try {
        const res = await fetch(`${API_BASE}/profile/skills`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ skillName, type })
        });

        const data = await res.json();

        if (!res.ok) {
            showMessage(data.error || "Could not add skill.", "danger");
            return;
        }

        // Update local state and re-render
        if (type === "offering") {
            // avoid duplicate display
            if (!__profileSkills.offering.find(s => s.id === data.id)) {
                __profileSkills.offering.push({ id: data.id, name: data.name });
            }
            renderTagList("teachTags", __profileSkills.offering, "offering");
        } else {
            if (!__profileSkills.learning.find(s => s.id === data.id)) {
                __profileSkills.learning.push({ id: data.id, name: data.name });
            }
            renderTagList("learnTags", __profileSkills.learning, "learning");
        }

        input.value = "";

    } catch (err) {
        showMessage("Could not connect to server.", "danger");
    }
}

async function removeSkill(containerId, skillId, type) {
    const token = localStorage.getItem("campusskill_token");

    try {
        await fetch(`${API_BASE}/profile/skills/${skillId}/${type}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (type === "offering") {
            __profileSkills.offering = __profileSkills.offering.filter(s => s.id !== skillId);
            renderTagList("teachTags", __profileSkills.offering, "offering");
        } else {
            __profileSkills.learning = __profileSkills.learning.filter(s => s.id !== skillId);
            renderTagList("learnTags", __profileSkills.learning, "learning");
        }

    } catch (err) {
        showMessage("Could not remove skill.", "danger");
    }
}

async function handleProfileSave(event) {
    event.preventDefault();

    const token      = localStorage.getItem("campusskill_token");
    const username   = document.getElementById("profileName").value.trim();
    const department = document.getElementById("profileDepartment").value;
    const year       = document.getElementById("profileYear").value;
    const bio        = document.getElementById("profileBio").value.trim();

    try {
        const res = await fetch(`${API_BASE}/profile/update`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ username, bio, department, year })
        });

        const data = await res.json();

        if (!res.ok) {
            showMessage(data.error || "Could not save profile.", "danger");
            return;
        }

        // Keep localStorage user object in sync
        const storedUser = JSON.parse(localStorage.getItem("campusskill_user") || "{}");
        storedUser.username = data.username;
        localStorage.setItem("campusskill_user", JSON.stringify(storedUser));

        // Update avatar initials
        const avatarEl = document.getElementById("profileAvatarLetters");
        if (avatarEl) {
            avatarEl.textContent = data.username
                .split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
        }

        showMessage("Profile updated successfully!");

    } catch (err) {
        showMessage("Could not connect to server.", "danger");
    }
}


/* =========================================
   Dashboard page — show real user name & skills
   ========================================= */

async function initDashboardPage() {
    const welcomeEl = document.getElementById("dashboardWelcome");
    if (!welcomeEl) return;

    const token = localStorage.getItem("campusskill_token");
    if (!token) {
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/profile/me`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (res.status === 401) {
            window.location.href = "login.html";
            return;
        }

        const user = await res.json();
        welcomeEl.textContent = `Welcome back, ${user.username}!`;

        // Load and show skills
        const skillsRes = await fetch(`${API_BASE}/profile/skills`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const skillsData = await skillsRes.json();

        const teachEl = document.getElementById("dashboardTeachSkills");
        const learnEl = document.getElementById("dashboardLearnSkills");

        if (teachEl) {
            teachEl.innerHTML = skillsData.offering.length
                ? skillsData.offering.map(s => `<span>${s.name}</span>`).join("")
                : "<span style=\"color:#64748b\">No skills added yet — <a href='profile.html'>add some!</a></span>";
        }
        if (learnEl) {
            learnEl.innerHTML = skillsData.learning.length
                ? skillsData.learning.map(s => `<span>${s.name}</span>`).join("")
                : "<span style=\"color:#64748b\">No skills added yet — <a href='profile.html'>add some!</a></span>";
        }

    } catch (err) {
        console.error("Dashboard load error:", err);
    }
}


/* =========================================
   Page bootstrapping
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initSearchPage();
    loadStudentProfile();
    initRequestsPage();
    initProfilePage();
    initDashboardPage();
});

