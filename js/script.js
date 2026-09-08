/* =========================================
   Campus Skill Exchange - JavaScript
   ========================================= */

// Backend API base URL
// Relative path works on both localhost (Express serves everything) and Vercel
const API_BASE = "/api";

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

async function fetchAndRenderSuggestions() {
    const container = document.getElementById("suggestionResults");
    if (!container) return;

    const token = localStorage.getItem("campusskill_token");
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE}/users/suggestions`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!res.ok) throw new Error("Failed to fetch suggestions");

        const users = await res.json();
        
        if (users.length === 0) {
            document.getElementById("suggestionsCard").style.display = "none";
            return;
        }

        container.innerHTML = users.map(u => {
            let badgeHtml = '';
            if (u.matchScore >= 4) {
                badgeHtml = `<span class="suggestion-match-badge high">🔥 High Match</span>`;
            } else if (u.matchScore >= 2) {
                badgeHtml = `<span class="suggestion-match-badge medium">⭐ Good Match</span>`;
            } else {
                badgeHtml = `<span class="suggestion-match-badge">💡 Recommended</span>`;
            }

            return `
            <div class="student-item">
                <div class="student-avatar">${u.initials}</div>
                <div class="student-info">
                    <h3>${u.name} ${badgeHtml}</h3>
                    <p>${u.department} &middot; ${u.year}</p>
                    <div class="mini-skills">
                        ${u.teach.map(skill => `<span>${skill}</span>`).join("")}
                    </div>
                </div>
                <div class="quick-actions" style="flex-direction: row; gap: 8px;">
                    <a href="student-profile.html?id=${u.id}" class="outline-btn" style="text-decoration:none; text-align:center;">View Profile</a>
                </div>
            </div>
            `;
        }).join("");

    } catch (err) {
        console.error("Suggestions error:", err);
        container.innerHTML = "<p>Could not load suggestions.</p>";
    }
}

async function fetchAndRenderStudents(query = "", department = "all") {
    const container = document.getElementById("studentResults");
    if (!container) return;

    const token = localStorage.getItem("campusskill_token");
    if (!token) return;

    try {
        const url = new URL(`${API_BASE}/users/search`, window.location.origin);
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

    // Show/hide suggestions card based on active search
    const suggestionsCard = document.getElementById("suggestionsCard");
    if (suggestionsCard) {
        if (query === "" && department === "all") {
            suggestionsCard.style.display = "block";
        } else {
            suggestionsCard.style.display = "none";
        }
    }

    // Debounce the search input
    if (_searchTimeout) clearTimeout(_searchTimeout);
    
    _searchTimeout = setTimeout(() => {
        fetchAndRenderStudents(query, department);
    }, 300);
}

function initSearchPage() {
    if (!document.getElementById("studentResults")) return;
    fetchAndRenderSuggestions();
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
        const msgBtn = `<button class="outline-btn" onclick="chatStartWithUser('${student.id}', '${student.name}')" style="margin-left:8px;">💬 Message</button>`;
        if (connectionStatus === "accepted") {
            actionButtonHTML = `
                <button class="outline-btn" disabled style="cursor:default;">Connected</button>
                <button class="outline-btn" onclick="removeConnection('${activeReq ? activeReq.id : ''}', '${student.name}')" style="color:#ef4444; border-color:#fca5a5; margin-left:10px; cursor:pointer;">Remove Connection</button>
                ${msgBtn}
            `;
        } else if (connectionStatus === "pending") {
            actionButtonHTML = `<button class="outline-btn" disabled style="cursor:default;">${requestMsg}</button>${msgBtn}`;
        } else {
            actionButtonHTML = `<button class="primary-btn" id="sendRequestBtn" onclick="sendCollaborationRequest('${student.id}', '${student.name}')">Send Collaboration Request</button>${msgBtn}`;
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



/* =============================================================================
   My Connections List — render accepted connections on the dashboard
   ============================================================================= */

async function renderConnectionsList() {
    const connListEl = document.getElementById("dashboardConnectionsList");
    if (!connListEl) return;

    const token = localStorage.getItem("campusskill_token");
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE}/requests`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (!res.ok) return;
        const { incoming = [], outgoing = [] } = await res.json();

        // Build normalised list of accepted connections
        const connections = [
            ...incoming.filter(r => r.status === "accepted").map(r => ({
                id: r.user_id, name: r.name,
                department: r.department || "", year: r.year || ""
            })),
            ...outgoing.filter(r => r.status === "accepted").map(r => ({
                id: r.user_id, name: r.name,
                department: r.department || "", year: r.year || ""
            }))
        ];

        if (connections.length === 0) {
            connListEl.innerHTML =
                '<div class="connections-empty">' +
                    '<p>You have no connections yet.</p>' +
                    '<a href="search.html">Find students to connect with &rarr;</a>' +
                '</div>';
            return;
        }

        let rows = "";
        for (const c of connections) {
            const initials = c.name.split(" ").map(function(n){ return n[0]; }).join("").slice(0,2).toUpperCase();
            const meta     = [c.department, c.year].filter(Boolean).join(" \u00b7 ") || "Campus Student";
            const safeName = c.name.replace(/'/g, "&#39;");
            rows += '<div class="connection-item">' +
                        '<div class="connection-avatar">' + initials + '</div>' +
                        '<div class="connection-info">' +
                            '<div class="connection-name">' + c.name + '</div>' +
                            '<div class="connection-meta">' + meta + '</div>' +
                        '</div>' +
                        '<div class="connection-actions">' +
                            '<a href="student-profile.html?id=' + c.id + '">View</a>' +
                            '<button class="chat-btn" onclick="chatStartWithUser(\'' + c.id + '\', \'' + safeName + '\')">&#128172; Chat</button>' +
                        '</div>' +
                    '</div>';
        }

        connListEl.innerHTML = '<div class="connections-list">' + rows + '</div>';
    } catch (err) {
        console.error("renderConnectionsList error:", err);
    }
}


/* =============================================================================
   LinkedIn-Style Chat - REST + Short-Polling (Vercel-safe, no WebSockets)
   ============================================================================= */

const chatState = {
    openWindows: {},
    trayOpen: false,
};

// ------------------------------------------------------------------
function chatToggleTray() {
    const tray = document.getElementById("chatTray");
    const btn  = document.getElementById("chatTrayToggle");
    if (!tray) return;

    chatState.trayOpen = !chatState.trayOpen;
    tray.classList.toggle("collapsed", !chatState.trayOpen);
    btn.textContent = chatState.trayOpen ? "▼" : "▲";

    if (chatState.trayOpen) {
        chatLoadConversations();
    }
}

// ------------------------------------------------------------------
// Load all conversations into the tray
// ------------------------------------------------------------------
async function chatLoadConversations() {
    const token = localStorage.getItem("campusskill_token");
    if (!token) return;

    const listEl = document.getElementById("chatConversationList");
    if (!listEl) return;

    try {
        const res  = await fetch(`${API_BASE}/chat/conversations`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("fetch failed");
        const convs = await res.json();

        if (!convs.length) {
            listEl.innerHTML = '<p id="chatTrayEmpty">No conversations yet.<br><small>Message someone from their profile.</small></p>';
            return;
        }

        listEl.innerHTML = convs.map(c => {
            const initials = c.other_user_name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();
            const preview  = c.last_message ? c.last_message.substring(0, 38) + (c.last_message.length > 38 ? "…" : "") : "No messages yet";
            return `
                <div class="chat-conv-item" onclick="chatOpenWindow('${c.id}', '${c.other_user_id}', '${c.other_user_name.replace(/'/g,"&#39;")}')">
                    <div class="chat-conv-avatar">${initials}</div>
                    <div class="chat-conv-info">
                        <div class="chat-conv-name">${c.other_user_name}</div>
                        <div class="chat-conv-preview">${preview}</div>
                    </div>
                </div>`;
        }).join("");
    } catch (err) {
        console.error("chatLoadConversations error:", err);
    }
}

// ------------------------------------------------------------------
// Open (or focus) a chat window for a conversation
// ------------------------------------------------------------------
async function chatOpenWindow(conversationId, otherUserId, otherUserName) {
    // If window is already open, just focus it
    if (chatState.openWindows[conversationId]) {
        const win = document.getElementById(`chat-win-${conversationId}`);
        if (win && win.classList.contains("collapsed")) {
            win.classList.remove("collapsed");
        }
        return;
    }

    const dock = document.getElementById("chatDock");
    if (!dock) return;

    // Max 3 windows open at once — close oldest if needed
    const openIds = Object.keys(chatState.openWindows);
    if (openIds.length >= 3) {
        chatCloseWindow(openIds[0]);
    }

    const initials = otherUserName.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase();

    const win = document.createElement("div");
    win.className = "chat-window";
    win.id = `chat-win-${conversationId}`;
    win.innerHTML = `
        <div class="chat-window-header" onclick="chatToggleWindow('${conversationId}')">
            <div class="chat-window-avatar">${initials}</div>
            <span class="chat-window-title">${otherUserName}</span>
            <div class="chat-window-actions" onclick="event.stopPropagation()">
                <button title="Collapse" onclick="chatToggleWindow('${conversationId}')">—</button>
                <button title="Close" onclick="chatCloseWindow('${conversationId}')">✕</button>
            </div>
        </div>
        <div class="chat-messages" id="chat-msgs-${conversationId}">
            <p class="chat-msg-loading">Loading…</p>
        </div>
        <div class="chat-input-bar">
            <input type="text"
                   id="chat-input-${conversationId}"
                   placeholder="Write a message…"
                   onkeydown="if(event.key==='Enter')chatSendMessage('${conversationId}','${otherUserId}')">
            <button onclick="chatSendMessage('${conversationId}','${otherUserId}')" title="Send">➤</button>
        </div>`;

    // Insert before the tray
    dock.insertBefore(win, document.getElementById("chatTray"));

    // Track this window, start polling
    const intervalId = setInterval(() => chatPollMessages(conversationId), 5000);
    chatState.openWindows[conversationId] = { intervalId, otherUserId, otherUserName };

    // Load initial messages immediately
    await chatFetchMessages(conversationId);
}

// ------------------------------------------------------------------
// Toggle collapse/expand of an individual chat window
// ------------------------------------------------------------------
function chatToggleWindow(conversationId) {
    const win = document.getElementById(`chat-win-${conversationId}`);
    if (win) win.classList.toggle("collapsed");
}

// ------------------------------------------------------------------
// Close a chat window and stop its polling interval
// ------------------------------------------------------------------
function chatCloseWindow(conversationId) {
    const state = chatState.openWindows[conversationId];
    if (state) {
        clearInterval(state.intervalId);
        delete chatState.openWindows[conversationId];
    }
    const win = document.getElementById(`chat-win-${conversationId}`);
    if (win) win.remove();
}

// ------------------------------------------------------------------
// Fetch and render messages for a conversation
// ------------------------------------------------------------------
async function chatFetchMessages(conversationId) {
    const token = localStorage.getItem("campusskill_token");
    if (!token) return;

    const msgsEl = document.getElementById(`chat-msgs-${conversationId}`);
    if (!msgsEl) return;

    try {
        const res = await fetch(`${API_BASE}/chat/conversations/${conversationId}/messages`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error("fetch failed");
        const messages = await res.json();

        const currentUserId = JSON.parse(localStorage.getItem("campusskill_user") || "{}").id;
        const wasAtBottom = msgsEl.scrollHeight - msgsEl.scrollTop <= msgsEl.clientHeight + 40;

        msgsEl.innerHTML = messages.length
            ? messages.map(m => {
                const isMine = m.sender_id === currentUserId;
                const time   = new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
                return `<div class="chat-msg ${isMine ? "sent" : "received"}">
                            ${m.content}
                            <span class="msg-time">${time}</span>
                        </div>`;
              }).join("")
            : '<p class="chat-msg-loading">No messages yet. Say hello! 👋</p>';

        // Auto-scroll to bottom only if user was already near bottom
        if (wasAtBottom || messages.length <= 1) {
            msgsEl.scrollTop = msgsEl.scrollHeight;
        }
    } catch (err) {
        console.error("chatFetchMessages error:", err);
    }
}

// ------------------------------------------------------------------
// Polling callback — called every 5 seconds per open window
// ------------------------------------------------------------------
async function chatPollMessages(conversationId) {
    const win = document.getElementById(`chat-win-${conversationId}`);
    if (!win || win.classList.contains("collapsed")) return;
    await chatFetchMessages(conversationId);
}

// ------------------------------------------------------------------
// Send a message in a conversation
// ------------------------------------------------------------------
async function chatSendMessage(conversationId, receiverId) {
    const token   = localStorage.getItem("campusskill_token");
    const inputEl = document.getElementById(`chat-input-${conversationId}`);
    if (!token || !inputEl) return;

    const content = inputEl.value.trim();
    if (!content) return;

    inputEl.value = "";
    inputEl.disabled = true;

    try {
        const res = await fetch(`${API_BASE}/chat/send`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ receiver_id: receiverId, content })
        });

        if (!res.ok) {
            const data = await res.json();
            showMessage(data.error || "Failed to send message.", "danger");
        } else {
            // Immediately refresh messages after sending
            await chatFetchMessages(conversationId);
        }
    } catch (err) {
        showMessage("Could not connect to server.", "danger");
    } finally {
        inputEl.disabled = false;
        inputEl.focus();
    }
}

// ------------------------------------------------------------------
// Open a chat with a specific user from their profile page.
// Called by the "Message" button on student-profile.html.
// ------------------------------------------------------------------
async function chatStartWithUser(otherUserId, otherUserName) {
    const token = localStorage.getItem("campusskill_token");
    if (!token) {
        showMessage("Please log in to send messages.", "danger");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/chat/conversations/open`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ other_user_id: otherUserId })
        });

        if (!res.ok) throw new Error("Could not open conversation");
        const data = await res.json();

        // If we are NOT on dashboard, redirect there first
        if (!document.getElementById("chatDock")) {
            // Store pending chat in sessionStorage, pick up on dashboard load
            sessionStorage.setItem("pendingChat", JSON.stringify({
                conversationId: data.conversation_id,
                otherUserId: data.other_user_id,
                otherUserName: data.other_user_name
            }));
            window.location.href = "dashboard.html";
        } else {
            chatOpenWindow(data.conversation_id, data.other_user_id, data.other_user_name);
        }
    } catch (err) {
        showMessage("Could not start conversation.", "danger");
    }
}

// ------------------------------------------------------------------
// On dashboard load: restore any pending chat from another page
// ------------------------------------------------------------------
function chatRestorePending() {
    const raw = sessionStorage.getItem("pendingChat");
    if (!raw) return;
    sessionStorage.removeItem("pendingChat");
    try {
        const { conversationId, otherUserId, otherUserName } = JSON.parse(raw);
        // Small delay so the dock DOM is ready
        setTimeout(() => chatOpenWindow(conversationId, otherUserId, otherUserName), 300);
    } catch (_) {}
}

// ------------------------------------------------------------------
// Init chat on dashboard page
// ------------------------------------------------------------------
function initChatDock() {
    if (!document.getElementById("chatDock")) return;
    chatRestorePending();
    // Pre-load conversation list in background (tray stays collapsed)
    const token = localStorage.getItem("campusskill_token");
    if (token) chatLoadConversations();
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
    initChatDock();
    renderConnectionsList();
});
