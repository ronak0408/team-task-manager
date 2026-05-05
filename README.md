# 📋 Team Task Manager (Full-Stack)

A production-ready full-stack task management application featuring Role-Based Access Control (RBAC), real-time status updates, and dynamic dashboards. Built with the MERN stack and deployed on Vercel and Railway.

**🔗 [View Live Application](https://team-task-manager-phi-six.vercel.app/)**

## ✨ Key Features
- **Authentication & Authorization:** Secure JWT-based login with hashed passwords (bcrypt).
- **Role-Based Access Control (RBAC):**
  - **Admins:** Can create projects, add members, and assign tasks.
  - **Members:** Can view assigned projects and update task statuses (Todo ➡️ In-Progress ➡️ Done).
- **Interactive Kanban Board:** Clean UI for managing task workflows.
- **Dynamic Dashboard:** Real-time calculation of total, pending, completed, and overdue tasks.
- **Responsive Design:** Built with Tailwind CSS for seamless use on any device.

## 🧱 Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS, Context API, Axios, React Router, Lucide Icons.
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, bcryptjs.
- **Deployment:** Vercel (Frontend) & Railway (Backend).

## 🚀 Run Locally

**1. Clone the repository:**
\`\`\`bash
git clone https://github.com/ronak0408/team-task-manager.git
cd team-task-manager
\`\`\`

**2. Setup Backend:**
\`\`\`bash
cd backend
npm install
\`\`\`
Create a `.env` file in the `backend/` directory:
\`\`\`env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
\`\`\`
Start backend server: `npm run dev`

**3. Setup Frontend:**
\`\`\`bash
cd ../frontend
npm install
\`\`\`
Create a `.env` file in the `frontend/` directory:
\`\`\`env
VITE_API_URL=http://localhost:5000/api
\`\`\`
Start frontend server: `npm run dev`

## 📂 Folder Structure
A clean Monorepo architecture separating the REST API and the React Client.
- `/backend`: Contains Express server, MongoDB models, Auth & RBAC middleware, and controllers.
- `/frontend`: Contains Vite+React app, Context API state management, Axios interceptors, and Tailwind UI pages.
