CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    bio TEXT,
    department VARCHAR(100),
    year VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Skills Table (catalog of all available skills)
CREATE TABLE IF NOT EXISTS skills (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL DEFAULT 'General'
);

-- User Skills (links users to skills they offer or want to learn)
CREATE TABLE IF NOT EXISTS user_skills (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(id) ON DELETE CASCADE,
    type VARCHAR(20) CHECK (type IN ('offering', 'learning')),
    PRIMARY KEY (user_id, skill_id, type)
);

-- Requests Table (skill-swap bookings)
CREATE TABLE IF NOT EXISTS requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider_id UUID REFERENCES users(id) ON DELETE CASCADE,
    skill_id INT REFERENCES skills(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Chat: Conversations Table (a thread between exactly two users)
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enforce that each pair of users has at most one conversation (order independent)
CREATE UNIQUE INDEX IF NOT EXISTS unique_conversation 
    ON conversations (LEAST(user1_id, user2_id), GREATEST(user1_id, user2_id));

-- Chat: Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast message retrieval per conversation
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id, created_at);


-- =============================================================================
--  SEED DATA: 20 Varied User Profiles, Skills & Interconnections
--  Default password for all demo accounts: password123
-- =============================================================================

-- 1. Insert Skills Catalog
INSERT INTO skills (id, name, category) VALUES
(1,  'Python',                    'Programming'),
(2,  'JavaScript',                'Web Development'),
(3,  'React',                     'Frontend'),
(4,  'Node.js',                   'Backend'),
(5,  'Data Structures & Algorithms', 'Computer Science'),
(6,  'C++',                       'Programming'),
(7,  'Java',                      'Programming'),
(8,  'Machine Learning',          'AI & Data'),
(9,  'UI/UX Design',              'Design'),
(10, 'Figma',                     'Design'),
(11, 'Flutter',                   'Mobile Development'),
(12, 'SQL & Databases',           'Backend'),
(13, 'Docker & DevOps',           'DevOps'),
(14, 'Arduino & Embedded',        'Hardware & IoT'),
(15, 'Cyber Security & Linux',    'Security'),
(16, 'CAD & 3D Modeling',         'Engineering'),
(17, 'Deep Learning & NLP',       'AI & Data'),
(18, 'HTML & CSS',                'Web Development'),
(19, 'Cloud Computing (AWS)',     'DevOps'),
(20, 'Go Programming',            'Backend')
ON CONFLICT (id) DO NOTHING;

-- Reset skills sequence to continue after 20
SELECT setval('skills_id_seq', (SELECT MAX(id) FROM skills));


-- 2. Insert 20 Varied Users
-- Default password: password123 (hash: $2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa)
INSERT INTO users (id, username, email, password_hash, bio, department, year) VALUES
-- Experienced Mentors / Seniors
('a0000000-0000-0000-0000-000000000001', 'Ananya Sharma', 'ananya.sharma@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Senior frontend tutor with 2+ years of experience. Built multiple production web apps in React and mentored 30+ juniors.', 'Computer Science', '3rd Year'),
('a0000000-0000-0000-0000-000000000002', 'Vikram Kumar', 'vikram.kumar@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Competitive programming specialist and algorithms mentor. Ranked top 5% on LeetCode. Love breaking down complex graph and dynamic programming problems.', 'Computer Science', '4th Year'),
('a0000000-0000-0000-0000-000000000003', 'Sarah Khan', 'sarah.khan@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Hardware lead for the college robotics team. Passionate about IoT microcontrollers, sensor integration, and Arduino coding.', 'Electronics', '4th Year'),
('a0000000-0000-0000-0000-000000000004', 'Rahul Kumar', 'rahul.kumar@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'AI researcher and ML tutor. Worked on computer vision and tabular models using PyTorch and Scikit-Learn. Looking to master full-stack deployment.', 'Data Science', '4th Year'),
('a0000000-0000-0000-0000-000000000005', 'Meera Iyer', 'meera.iyer@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Cloud and DevOps tutor. Certified AWS Cloud Practitioner. I help students set up CI/CD pipelines, Docker containers, and scalable server infrastructure.', 'Information Technology', '4th Year'),

-- Intermediate / Active Collaborators
('a0000000-0000-0000-0000-000000000006', 'Priya Mehta', 'priya.mehta@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Design lead at Campus Innovation Cell. Teaching Figma design systems, wireframing, and interactive prototyping. Eager to pick up frontend code!', 'Design', '3rd Year'),
('a0000000-0000-0000-0000-000000000007', 'Aman Gupta', 'aman.gupta@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Full-stack web enthusiast. Built REST APIs using Express and Postgres. Currently expanding into Docker and microservices architecture.', 'Computer Science', '2nd Year'),
('a0000000-0000-0000-0000-000000000008', 'Devansh Joshi', 'devansh.joshi@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Cross-platform mobile developer. Published 2 Flutter apps on Play Store. Looking for backend partners to collaborate on hackathons.', 'Information Technology', '3rd Year'),
('a0000000-0000-0000-0000-000000000009', 'Disha Jain', 'disha.jain@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'SolidWorks and CAD designer. Love 3D printing and physical prototyping. Learning Python for engineering automation on the side.', 'Mechanical', '2nd Year'),
('a0000000-0000-0000-0000-000000000010', 'Karan Malhotra', 'karan.malhotra@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Exploring Large Language Models, prompt engineering, and RAG pipelines. Happy to teach data science concepts in exchange for React guidance.', 'Data Science', '3rd Year'),
('a0000000-0000-0000-0000-000000000011', 'Aditya Rao', 'aditya.rao@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Mechatronics enthusiast. Built automated greenhouse and obstacle avoidance robots. Can help with Arduino, sensors, and basic circuits.', 'Mechanical', '3rd Year'),
('a0000000-0000-0000-0000-000000000012', 'Nikhil Saxena', 'nikhil.saxena@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Backend developer building high-concurrency services in Go. Interested in distributed systems and cloud deployments.', 'Information Technology', '3rd Year'),

-- Freshmen / Eager Beginners (Newbies)
('a0000000-0000-0000-0000-000000000013', 'Rohan Verma', 'rohan.verma@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', '1st year beginner! Just completed Python 101. Excited to learn web development and collaborate with friendly seniors.', 'Computer Science', '1st Year'),
('a0000000-0000-0000-0000-000000000014', 'Kavya Nair', 'kavya.nair@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Freshman studying biotech. Need help starting with Python for biological data analysis. Can share biology research basics!', 'Biotechnology', '1st Year'),
('a0000000-0000-0000-0000-000000000015', 'Tanmay Bhatia', 'tanmay.bhatia@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Cyber security novice. Running Kali Linux in a VM and learning bash scripting. Looking for study buddies for CTF challenges.', 'Information Technology', '1st Year'),
('a0000000-0000-0000-0000-000000000016', 'Simran Kaur', 'simran.kaur@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Starting my CS journey with Java and Object-Oriented Programming. Patient learner who enjoys group study sessions.', 'Computer Science', '1st Year'),
('a0000000-0000-0000-0000-000000000017', 'Sneha Patel', 'sneha.patel@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Electrical engineering sophomore. Good with circuit analysis and MATLAB. Striving to pick up C++ for hardware programming.', 'Electrical', '2nd Year'),
('a0000000-0000-0000-0000-000000000018', 'Pooja Hegde', 'pooja.hegde@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Visual designer and illustrator. Passionate about color theory, posters, and branding. Eager to learn modern web frontend basics.', 'Design', '2nd Year'),
('a0000000-0000-0000-0000-000000000019', 'Ishita Sen', 'ishita.sen@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Civil engineering student skilled in AutoCAD. Looking to learn Excel macros, SQL, and data visualization for project management.', 'Civil', '2nd Year'),
('a0000000-0000-0000-0000-000000000020', 'Zoya Farooqui', 'zoya.farooqui@campus.edu', '$2b$10$vI8aWBnW3fID.ZQ4/zo1G.q1lRps.9cGLcZEiGDMVr5yUP1KUOYTa', 'Electronics enthusiast experimenting with digital logic design and FPGA basics. Keen to learn low-level C programming.', 'Electronics', '2nd Year')
ON CONFLICT (id) DO NOTHING;


-- 3. Insert Skills Offered and Desired (user_skills)
INSERT INTO user_skills (user_id, skill_id, type) VALUES
-- Ananya Sharma
('a0000000-0000-0000-0000-000000000001', 3,  'offering'),
('a0000000-0000-0000-0000-000000000001', 2,  'offering'),
('a0000000-0000-0000-0000-000000000001', 18, 'offering'),
('a0000000-0000-0000-0000-000000000001', 13, 'learning'),
('a0000000-0000-0000-0000-000000000001', 19, 'learning'),

-- Vikram Kumar
('a0000000-0000-0000-0000-000000000002', 5,  'offering'),
('a0000000-0000-0000-0000-000000000002', 6,  'offering'),
('a0000000-0000-0000-0000-000000000002', 3,  'learning'),
('a0000000-0000-0000-0000-000000000002', 8,  'learning'),

-- Sarah Khan
('a0000000-0000-0000-0000-000000000003', 14, 'offering'),
('a0000000-0000-0000-0000-000000000003', 6,  'offering'),
('a0000000-0000-0000-0000-000000000003', 1,  'learning'),
('a0000000-0000-0000-0000-000000000003', 8,  'learning'),

-- Rahul Kumar
('a0000000-0000-0000-0000-000000000004', 8,  'offering'),
('a0000000-0000-0000-0000-000000000004', 12, 'offering'),
('a0000000-0000-0000-0000-000000000004', 1,  'offering'),
('a0000000-0000-0000-0000-000000000004', 3,  'learning'),
('a0000000-0000-0000-0000-000000000004', 4,  'learning'),

-- Meera Iyer
('a0000000-0000-0000-0000-000000000005', 19, 'offering'),
('a0000000-0000-0000-0000-000000000005', 13, 'offering'),
('a0000000-0000-0000-0000-000000000005', 20, 'learning'),

-- Priya Mehta
('a0000000-0000-0000-0000-000000000006', 9,  'offering'),
('a0000000-0000-0000-0000-000000000006', 10, 'offering'),
('a0000000-0000-0000-0000-000000000006', 11, 'learning'),
('a0000000-0000-0000-0000-000000000006', 3,  'learning'),

-- Aman Gupta
('a0000000-0000-0000-0000-000000000007', 4,  'offering'),
('a0000000-0000-0000-0000-000000000007', 12, 'offering'),
('a0000000-0000-0000-0000-000000000007', 13, 'learning'),
('a0000000-0000-0000-0000-000000000007', 19, 'learning'),

-- Devansh Joshi
('a0000000-0000-0000-0000-000000000008', 11, 'offering'),
('a0000000-0000-0000-0000-000000000008', 4,  'learning'),
('a0000000-0000-0000-0000-000000000008', 9,  'learning'),

-- Disha Jain
('a0000000-0000-0000-0000-000000000009', 16, 'offering'),
('a0000000-0000-0000-0000-000000000009', 1,  'learning'),

-- Karan Malhotra
('a0000000-0000-0000-0000-000000000010', 17, 'offering'),
('a0000000-0000-0000-0000-000000000010', 1,  'offering'),
('a0000000-0000-0000-0000-000000000010', 3,  'learning'),

-- Aditya Rao
('a0000000-0000-0000-0000-000000000011', 14, 'offering'),
('a0000000-0000-0000-0000-000000000011', 16, 'offering'),
('a0000000-0000-0000-0000-000000000011', 1,  'learning'),

-- Nikhil Saxena
('a0000000-0000-0000-0000-000000000012', 20, 'offering'),
('a0000000-0000-0000-0000-000000000012', 13, 'learning'),
('a0000000-0000-0000-0000-000000000012', 19, 'learning'),

-- Rohan Verma
('a0000000-0000-0000-0000-000000000013', 1,  'offering'),
('a0000000-0000-0000-0000-000000000013', 18, 'learning'),
('a0000000-0000-0000-0000-000000000013', 2,  'learning'),
('a0000000-0000-0000-0000-000000000013', 5,  'learning'),

-- Kavya Nair
('a0000000-0000-0000-0000-000000000014', 1,  'learning'),

-- Tanmay Bhatia
('a0000000-0000-0000-0000-000000000015', 15, 'offering'),
('a0000000-0000-0000-0000-000000000015', 6,  'learning'),
('a0000000-0000-0000-0000-000000000015', 1,  'learning'),

-- Simran Kaur
('a0000000-0000-0000-0000-000000000016', 7,  'offering'),
('a0000000-0000-0000-0000-000000000016', 5,  'learning'),

-- Sneha Patel
('a0000000-0000-0000-0000-000000000017', 6,  'learning'),
('a0000000-0000-0000-0000-000000000017', 14, 'learning'),

-- Pooja Hegde
('a0000000-0000-0000-0000-000000000018', 9,  'offering'),
('a0000000-0000-0000-0000-000000000018', 18, 'learning'),

-- Ishita Sen
('a0000000-0000-0000-0000-000000000019', 16, 'offering'),
('a0000000-0000-0000-0000-000000000019', 1,  'learning'),
('a0000000-0000-0000-0000-000000000019', 12, 'learning'),

-- Zoya Farooqui
('a0000000-0000-0000-0000-000000000020', 14, 'offering'),
('a0000000-0000-0000-0000-000000000020', 6,  'learning')
ON CONFLICT (user_id, skill_id, type) DO NOTHING;


-- 4. Insert Requests
INSERT INTO requests (id, requester_id, provider_id, skill_id, status, message) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000005', 13, 'accepted', 'Hey Meera! I would love to learn Docker containerization from you for my React projects.'),
('b0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000001', 3,  'accepted', 'Hi Ananya, can you help me build a clean web frontend for my algorithmic visualizer?'),
('b0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000008', 11, 'accepted', 'Hi Devansh, love your mobile apps! Would be great to pair up on Flutter UI implementation.'),
('b0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000011', 14, 'accepted', 'Hey Aditya, lets collaborate on the robotic arm controller wiring and firmware!'),
('b0000000-0000-0000-0000-000000000005', 'a0000000-0000-0000-0000-000000000004', 'a0000000-0000-0000-0000-000000000010', 17, 'accepted', 'Hi Karan, let us exchange notes on transformer fine-tuning and PyTorch models.'),
('b0000000-0000-0000-0000-000000000006', 'a0000000-0000-0000-0000-000000000013', 'a0000000-0000-0000-0000-000000000002', 5,  'pending',  'Hello Vikram sir, I am a 1st year beginner and want to start with DSA fundamentals in C++.'),
('b0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000014', 'a0000000-0000-0000-0000-000000000004', 1,  'pending',  'Hi Rahul, could you guide me on using Python Pandas for biological DNA sequence datasets?'),
('b0000000-0000-0000-0000-000000000008', 'a0000000-0000-0000-0000-000000000018', 'a0000000-0000-0000-0000-000000000001', 18, 'pending',  'Hey Ananya, I can help you with branding/Figma if you can teach me CSS layouts!'),
('b0000000-0000-0000-0000-000000000009', 'a0000000-0000-0000-0000-000000000015', 'a0000000-0000-0000-0000-000000000002', 6,  'pending',  'Hi Vikram, looking to learn low-level C++ for cyber security exploit analysis.'),
('b0000000-0000-0000-0000-000000000010', 'a0000000-0000-0000-0000-000000000007', 'a0000000-0000-0000-0000-000000000002', 5,  'rejected', 'Currently focused on web development, will reconnect next semester.')
ON CONFLICT (id) DO NOTHING;