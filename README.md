# 🚀 LeadFlow CRM

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge\&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge\&logo=typescript\&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge\&logo=prisma)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge\&logo=tailwindcss\&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge\&logo=react-query\&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge\&logo=sqlite\&logoColor=white)

### A modern lightweight CRM built for efficient lead management, follow-up tracking, and discussion history.

</div>

---

# 📌 Overview

LeadFlow is a production-style single-screen CRM application designed to help sales representatives efficiently manage leads, track conversations, monitor follow-ups, and organize the sales pipeline.

The application focuses on simplicity, speed, and usability while maintaining a modern SaaS-grade user experience inspired by tools like:

* Linear
* Attio CRM
* Notion
* Vercel Dashboard

This project was built as part of the **Es Magico Fullstack Internship Assessment**.

---

# ✨ Features

## 📋 Lead Management

* Create new leads
* Track lead status
* View lead details instantly
* Search leads by name
* Filter leads by status

---

## 🧠 Discussion Timeline

Each lead contains a full reverse-chronological discussion timeline.

Features include:

* Discussion notes
* Timestamps
* Follow-up reminders
* Timeline visualization
* Status updates directly from modal

---

## ⏰ Follow-Up Tracking

* Set follow-up date and time
* Today's follow-ups pinned at the top
* Overdue follow-ups highlighted
* Instant UI updates

---

## 🎨 Modern SaaS UI

* Responsive dashboard layout
* Clean typography
* Smooth modal interactions
* Elegant card-based design
* Mobile responsive experience
* Accessible component structure

---

## ⚡ Performance & DX

* Optimistic UI updates
* React Query state management
* Prisma ORM integration
* Type-safe APIs
* Modular component architecture
* Reusable UI primitives

---

# 🛠️ Tech Stack

| Category         | Technology   |
| ---------------- | ------------ |
| Framework        | Next.js 15   |
| Language         | TypeScript   |
| Styling          | Tailwind CSS |
| UI Library       | shadcn/ui    |
| ORM              | Prisma       |
| Database         | SQLite       |
| State Management | React Query  |
| Icons            | Lucide React |
| Validation       | Zod          |
| Package Manager  | npm          |

---

# 🧱 Architecture

The project follows a modular and scalable frontend/backend architecture.

```bash
src/
├── app/
│   ├── api/
│   └── (app)/
│
├── components/
│   ├── dashboard/
│   ├── leads/
│   ├── layout/
│   ├── providers/
│   └── ui/
│
├── lib/
│   ├── db/
│   ├── validations/
│   ├── query/
│   └── utils/
│
├── config/
├── types/
└── prisma/
```

---

# 🖥️ Core Functionalities

## 1️⃣ Lead List Dashboard

Displays:

* Lead name
* Status badge
* Latest discussion note
* Relative timestamp
* Follow-up indicators

Additional capabilities:

* Search filtering
* Status filtering
* Pinned follow-ups
* Overdue highlighting

---

## 2️⃣ Timeline Modal

Clicking a lead opens a detailed modal containing:

* Lead information
* Status controls
* Full discussion history
* Follow-up tracking
* Discussion creation form

---

## 3️⃣ Add Lead Flow

Users can:

* Add new leads
* Save optional company details
* Add optional phone numbers
* Automatically assign "New" status

---

# 📷 Screenshots

## Dashboard

*Add your dashboard screenshot here*

---

## Lead Timeline Modal

*Add your modal screenshot here*

---

## Add Lead Modal

*Add your add lead modal screenshot here*

---

# 🎥 Demo Video

## 🔗 Demo Link

[https://youtu.be/sGpQ1gSjkuU](https://youtu.be/sGpQ1gSjkuU)

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Rishabh2254/leadflow-crm.git
```

---

## 2️⃣ Navigate to Project

```bash
cd leadflow
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Setup Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
```

---

## 5️⃣ Run Prisma Migration

```bash
npx prisma migrate dev
```

---

## 6️⃣ Seed Database

```bash
npx prisma db seed
```

---

## 7️⃣ Start Development Server

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

---

# 🧪 API Features

The application includes production-style API handling:

* Proper HTTP status codes
* Centralized validation
* Structured error handling
* Optimistic frontend updates
* Type-safe request handling

---

# 📦 Database Schema

## Lead

Stores:

* Name
* Company
* Phone
* Status
* Follow-up details
* Discussion relationship

---

## Discussion

Stores:

* Notes
* Timestamps
* Follow-up scheduling
* Lead relationship

---

# 🎯 Evaluation Matrix Coverage

## ✅ Functional Requirements

* Lead list with status and notes
* Timeline modal with discussion history
* Add lead functionality
* Status updates
* Follow-up tracking
* Real-time UI updates

---

## ✅ Code Quality

* Modular architecture
* Reusable components
* Clean TypeScript
* Structured APIs
* Organized folders

---

## ✅ Bonus Features

* Search functionality
* Status filters
* Overdue follow-up highlighting
* Seed data
* Responsive UI

---

# 📱 Responsive Design

The application is fully responsive across:

* Desktop
* Tablet
* Mobile devices

Optimized for modern SaaS dashboard experiences.

---

# 🧠 AI Usage Disclosure

AI tools were used to accelerate:

* UI prototyping
* component generation
* architectural brainstorming
* workflow optimization

All integration, refactoring, architecture decisions, debugging, backend integration, and production adaptation were manually handled and reviewed.

---

# 🚀 Future Improvements

Potential future enhancements:

* Authentication
* Team collaboration
* Email integration
* Notification system
* Activity analytics
* Kanban pipeline view
* Real-time updates
* Cloud database deployment

---

# 👨‍💻 Author

## Rishabh Srivastava

* Fullstack Developer
* AI & SaaS Enthusiast
* Backend + Frontend Engineering

GitHub:

[https://github.com/Rishabh2254](https://github.com/Rishabh2254)

---

# 📄 License

This project was created for assessment and educational purposes.

---

<div align="center">

### ⭐ If you found this project interesting, consider starring the repository.

Built with ❤️ using Next.js, Prisma, TypeScript, and Tailwind CSS.

</div>
