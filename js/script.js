/* =========================================
   Campus Skill Exchange - JavaScript
   ========================================= */

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

function handleRegistration(event) {

    event.preventDefault();

    const form = document.getElementById("registerForm");

    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const confirmPasswordInput =
        document.getElementById("confirmPassword");

    // Basic HTML validation
    if (!form.checkValidity()) {

        form.classList.add("was-validated");

        return;
    }

    // Password matching
    if (password !== confirmPassword) {

        confirmPasswordInput.setCustomValidity(
            "Passwords do not match"
        );

        form.classList.add("was-validated");

        return;
    }

    confirmPasswordInput.setCustomValidity("");

    // Demo success
    showMessage(
        "Account created successfully!",
        "success"
    );

    setTimeout(() => {

        window.location.href = "login.html";

    }, 1000);
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

// Demo login
function handleLogin(event) {
    event.preventDefault();

    if (!validateForm("loginForm")) {
        return;
    }

    showMessage("Login successful!");

    setTimeout(() => {
        window.location.href = "dashboard.html";
    }, 1000);
}


// Logout
function logout() {
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
   Profile editor page
   ========================================= */

const PROFILE_KEY = "campusskill_profile";

const DEFAULT_PROFILE = {
    name: "Aditi Verma",
    department: "Computer Science",
    year: "2nd Year",
    bio: "Passionate about full-stack web development and always excited to learn something new.",
    teach: ["HTML", "CSS", "JavaScript"],
    learn: ["React", "Node.js", "MongoDB"]
};

function loadProfile() {
    const stored = localStorage.getItem(PROFILE_KEY);

    if (!stored) {
        localStorage.setItem(PROFILE_KEY, JSON.stringify(DEFAULT_PROFILE));
        return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    }

    try {
        return JSON.parse(stored);
    } catch (e) {
        return JSON.parse(JSON.stringify(DEFAULT_PROFILE));
    }
}

function saveProfile(profile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}

function renderTagList(containerId, skills) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = skills.map(skill => `
        <span>
            ${skill}
            <button type="button" class="tag-remove" onclick="removeSkill('${containerId}', '${skill}')">&times;</button>
        </span>
    `).join("");
}

function getCurrentProfileState() {
    return window.__profileState;
}

function addSkill(field) {
    const inputId = field === "teach" ? "newTeachSkill" : "newLearnSkill";
    const input = document.getElementById(inputId);

    if (!input || !input.value.trim()) return;

    const state = getCurrentProfileState();
    const value = input.value.trim();

    if (!state[field].includes(value)) {
        state[field].push(value);
        renderTagList(field === "teach" ? "teachTags" : "learnTags", state[field]);
    }

    input.value = "";
}

function removeSkill(containerId, skill) {
    const field = containerId === "teachTags" ? "teach" : "learn";
    const state = getCurrentProfileState();

    state[field] = state[field].filter(s => s !== skill);
    renderTagList(containerId, state[field]);
}

function initProfilePage() {
    const form = document.getElementById("profileForm");
    if (!form) return;

    const profile = loadProfile();
    window.__profileState = profile;

    document.getElementById("profileName").value = profile.name;
    document.getElementById("profileDepartment").value = profile.department;
    document.getElementById("profileYear").value = profile.year;
    document.getElementById("profileBio").value = profile.bio;

    const avatarLetters = document.getElementById("profileAvatarLetters");
    if (avatarLetters) {
        avatarLetters.textContent = profile.name.split(" ").map(n => n[0]).join("").slice(0, 2);
    }

    renderTagList("teachTags", profile.teach);
    renderTagList("learnTags", profile.learn);

    form.addEventListener("submit", handleProfileSave);
}

function handleProfileSave(event) {
    event.preventDefault();

    const state = getCurrentProfileState();

    state.name = document.getElementById("profileName").value.trim() || state.name;
    state.department = document.getElementById("profileDepartment").value;
    state.year = document.getElementById("profileYear").value;
    state.bio = document.getElementById("profileBio").value.trim();

    saveProfile(state);
    showMessage("Profile updated successfully!");
}


/* =========================================
   Page bootstrapping
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {
    initSearchPage();
    loadStudentProfile();
    initRequestsPage();
    initProfilePage();
});
