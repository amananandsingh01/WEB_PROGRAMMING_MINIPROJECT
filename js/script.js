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

let _searchTimeout = null;

async function fetchAndRenderStudents(query = "", department = "all") {
    const container = document.getElementById("studentResults");
    if (!container) return;

    const token = localStorage.getItem("campusskill_token");
    if (!token) return;

    try {
        const url = new URL(`${API_BASE}/users/search`);
        if (query) url.searchParams.append("q", query);
        if (department && department !== "all") url.searchParams.append("department", department);

        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            throw new Error("Failed to fetch students");
        }

        const users = await res.json();
        
        // Add fake rating for UI purposes for now
        users.forEach(u => u.rating = 5.0);

        renderStudentResults(users);
    } catch (err) {
        console.error("Search error:", err);
    }
}

function filterStudents() {
    const searchInput = document.getElementById("studentSearch");
    const deptFilter = document.getElementById("departmentFilter");

    const query = searchInput ? searchInput.value.trim() : "";
    const department = deptFilter ? deptFilter.value : "all";

    // Debounce the search input
    if (_searchTimeout) clearTimeout(_searchTimeout);
    
    _searchTimeout = setTimeout(() => {
        fetchAndRenderStudents(query, department);
    }, 300);
}

function initSearchPage() {
    if (!document.getElementById("studentResults")) return;
    fetchAndRenderStudents();
}


/* =========================================
   Student profile page
   ========================================= */

function getQueryParam(name) {
    const params = new URLSearchParams(window.location.search);
    return params.get(name);
}

async function loadStudentProfile() {
    const wrapper = document.getElementById("studentProfileContent");
    if (!wrapper) return;

    const id = getQueryParam("id");
    if (!id) {
        wrapper.innerHTML = "<p>Student not found.</p>";
        return;
    }

    const token = localStorage.getItem("campusskill_token");
    if (!token) return;

    try {
        // Fetch user profile
        const res = await fetch(`${API_BASE}/users/${id}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            wrapper.innerHTML = "<p>Student not found.</p>";
            return;
        }

        const student = await res.json();
        
        // Fetch current user requests to check connection status
        const reqRes = await fetch(`${API_BASE}/requests`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const { incoming, outgoing } = await reqRes.json();
        
        // Check if there is an existing request involving this student
        const outgoingReq = outgoing.find(r => r.user_id === student.id);
        const incomingReq = incoming.find(r => r.user_id === student.id);
        const activeReq = outgoingReq || incomingReq;
        
        let connectionStatus = null; // null | "pending" | "accepted" | "rejected"
        let requestMsg = "";
        
        if (outgoingReq) {
            connectionStatus = outgoingReq.status;
            if (connectionStatus === "pending") requestMsg = "Request Pending";
            if (connectionStatus === "accepted") requestMsg = "Connected";
        } else if (incomingReq) {
            connectionStatus = incomingReq.status;
            if (connectionStatus === "pending") requestMsg = "Request Pending";
            if (connectionStatus === "accepted") requestMsg = "Connected";
        }

        document.title = `${student.name} - CampusSkill`;

        let actionButtonHTML = "";
        if (connectionStatus === "accepted") {
            actionButtonHTML = `
                <button class="outline-btn" disabled style="cursor:default;">Connected</button>
                <button class="outline-btn" onclick="removeConnection('${activeReq ? activeReq.id : ''}', '${student.name}')" style="color:#ef4444; border-color:#fca5a5; margin-left:10px; cursor:pointer;">Remove Connection</button>
            `;
        } else if (connectionStatus === "pending") {
            actionButtonHTML = `<button class="outline-btn" disabled style="cursor:default;">${requestMsg}</button>`;
        } else {
            actionButtonHTML = `<button class="primary-btn" id="sendRequestBtn" onclick="sendCollaborationRequest('${student.id}', '${student.name}')">Send Collaboration Request</button>`;
        }

        wrapper.innerHTML = `
            <div class="profile-hero">
                <div class="profile-hero-avatar">${student.initials}</div>
                <div>
                    <h1>${student.name}</h1>
                    <p>${student.department} &middot; ${student.year}</p>
                    <p>⭐ 5.0 &middot; 0 students taught &middot; 0 hours</p>
                </div>
            </div>

            <div class="dashboard-card">
                <h2>About</h2>
                <p>${student.bio || 'No bio provided.'}</p>
            </div>

            <div class="dashboard-card">
                <h2>Can Teach</h2>
                <div class="skill-tags">
                    ${student.teach.length ? student.teach.map(skill => `<span>${skill}</span>`).join("") : '<span style="color:#64748b">No skills added yet.</span>'}
                </div>
            </div>

            <div class="dashboard-card">
                <h2>Wants to Learn</h2>
                <div class="skill-tags">
                    ${student.learn.length ? student.learn.map(skill => `<span>${skill}</span>`).join("") : '<span style="color:#64748b">No skills added yet.</span>'}
                </div>
            </div>
            
            <div class="profile-actions">
                ${actionButtonHTML}
            </div>
        `;

    } catch (err) {
        console.error(err);
        wrapper.innerHTML = "<p>Error loading profile.</p>";
    }
}


/* =========================================
   Requests page & Collaboration (API-driven)
   ========================================= */

async function sendCollaborationRequest(providerId, providerName) {
    const token = localStorage.getItem("campusskill_token");
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE}/requests`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ provider_id: providerId })
        });

        const data = await res.json();
        
        if (!res.ok) {
            showMessage(data.error || "Could not send request.", "danger");
            return;
        }

        showMessage(`Request sent to ${providerName}!`, "success");
        
        // Reload the profile to show updated button state
        loadStudentProfile();
        
    } catch (err) {
        showMessage("Could not connect to server.", "danger");
    }
}

async function removeConnection(requestId, studentName) {
    if (!requestId) return;
    if (!confirm(`Are you sure you want to remove your connection with ${studentName}?`)) return;

    const token = localStorage.getItem("campusskill_token");
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE}/requests/${requestId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) {
            const data = await res.json();
            showMessage(data.error || "Failed to remove connection.", "danger");
            return;
        }

        showMessage(`Connection with ${studentName} removed.`);
        loadStudentProfile();
    } catch (err) {
        showMessage("Could not connect to server.", "danger");
    }
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
        actions = `<button class="outline-btn" onclick="respondToRequest('${type}', '${request.id}', 'cancel')">Cancel</button>`;
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

async function fetchAndRenderRequests() {
    const incomingEl = document.getElementById("incomingRequests");
    const outgoingEl = document.getElementById("outgoingRequests");
    if (!incomingEl && !outgoingEl) return;

    const token = localStorage.getItem("campusskill_token");
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE}/requests`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch requests");
        
        const data = await res.json();

        // Update badge count with pending incoming requests
        applyNavbarRequestBadge(data.incoming);

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
    } catch (err) {
        console.error("Requests load error:", err);
        if (incomingEl) incomingEl.innerHTML = "<p class='text-muted'>Error loading requests.</p>";
        if (outgoingEl) outgoingEl.innerHTML = "<p class='text-muted'>Error loading requests.</p>";
    }
}

function applyNavbarRequestBadge(incomingRequests = []) {
    const pendingCount = incomingRequests.filter(r => r.status === "pending").length;
    const navLinks = document.querySelectorAll('header.navbar nav a[href*="requests.html"]');
    navLinks.forEach(link => {
        let badge = link.querySelector('.requests-badge');
        if (pendingCount > 0) {
            if (!badge) {
                badge = document.createElement('span');
                badge.className = 'requests-badge';
                link.appendChild(badge);
            }
            badge.textContent = pendingCount > 99 ? '99+' : pendingCount;
        } else if (badge) {
            badge.remove();
        }
    });
}

async function updateNavbarRequestBadge() {
    const token = localStorage.getItem("campusskill_token");
    const navLinks = document.querySelectorAll('header.navbar nav a[href*="requests.html"]');
    if (!navLinks.length) return;

    if (!token) {
        navLinks.forEach(link => {
            const badge = link.querySelector('.requests-badge');
            if (badge) badge.remove();
        });
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/requests`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) return;
        const data = await res.json();
        applyNavbarRequestBadge(data.incoming || []);
    } catch (err) {
        console.error("Error updating request badge:", err);
    }
}

async function respondToRequest(type, id, action) {
    const token = localStorage.getItem("campusskill_token");
    if (!token) return;

    try {
        let res;
        if (action === 'cancel') {
            res = await fetch(`${API_BASE}/requests/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });
        } else {
            res = await fetch(`${API_BASE}/requests/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ status: action })
            });
        }

        if (!res.ok) {
            const errData = await res.json();
            showMessage(errData.error || "Action failed.", "danger");
            return;
        }

        if (action === "accepted") {
            showMessage(`Request accepted!`);
        } else if (action === "cancel") {
            showMessage("Request cancelled.");
        } else {
            showMessage("Request declined.");
        }
        
        // Refresh the list and update badge
        fetchAndRenderRequests();
        updateNavbarRequestBadge();

    } catch (err) {
        showMessage("Could not connect to server.", "danger");
    }
}

function initRequestsPage() {
    if (!document.getElementById("incomingRequests")) return;
    fetchAndRenderRequests();
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

        // Update skills count stat card
        const totalSkills = (skillsData.offering || []).length + (skillsData.learning || []).length;
        const skillsStatEl = document.getElementById("dashboardSkillsStat");
        if (skillsStatEl) {
            skillsStatEl.textContent = `${totalSkills} skill${totalSkills === 1 ? '' : 's'} listed`;
        }

        // Fetch requests to update requests count and connections count
        const reqRes = await fetch(`${API_BASE}/requests`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (reqRes.ok) {
            const reqData = await reqRes.json();
            const pendingIncoming = (reqData.incoming || []).filter(r => r.status === "pending").length;
            const acceptedCount = (reqData.incoming || []).filter(r => r.status === "accepted").length +
                                  (reqData.outgoing || []).filter(r => r.status === "accepted").length;

            const requestsStatEl = document.getElementById("dashboardRequestsStat");
            if (requestsStatEl) {
                requestsStatEl.textContent = `${pendingIncoming} pending`;
            }

            const connectionsStatEl = document.getElementById("dashboardConnectionsStat");
            if (connectionsStatEl) {
                connectionsStatEl.textContent = `${acceptedCount} student${acceptedCount === 1 ? '' : 's'}`;
            }
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
    updateNavbarRequestBadge();
});

