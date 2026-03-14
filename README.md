# Core Inventory 📦

Core Inventory is a modern, full-stack inventory management system built to streamline how businesses track, manage, and analyze their stock. This project was developed as a hackathon submission!

## 🚀 Live Demo

[View Live App on Vercel](https://your-vercel-deployment-url-here.vercel.app/)

## ✨ Features

- **Real-time Dashboard:** Instantly view key metrics like total products, low stock alerts, and recent movements.
- **Product Management:** Create, update, and categorize products with detailed SKUs and Unit of Measure tracking.
- **Stock Movements:** 
  - 📥 **Receipts:** Record incoming stock from vendors.
  - 📤 **Deliveries:** Dispatch stock to customers.
  - 🔄 **Transfers:** Move inventory between different internal locations.
  - ⚖️ **Adjustments:** Manually correct stock discrepancies.
- **Secure Authentication:** User login and session management powered by NextAuth.

## 🛠 Tech Stack

- **Frontend:** [Next.js 15 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) & [shadcn/ui](https://ui.shadcn.com/)
- **Backend & API:** Next.js Route Handlers & Server Actions
- **Database:** PostgreSQL (via [Neon](https://neon.tech/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js v4](https://next-auth.js.org/)

## 💻 Running Locally

### Prerequisites
- Node.js (v18 or higher)
- A PostgreSQL database string (e.g., from Neon, Supabase, or local)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/SiddhiPatel29/Code-Inventory.git
   cd Code-Inventory
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL="postgres://username:password@host:port/database"
   NEXTAUTH_SECRET="your-super-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Initialize database & seed data:**
   ```bash
   npx prisma db push
   npx prisma db seed
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏆 Hackathon Context

This project was built over a tight timeline focusing on delivering a functional, clean, and robust MVP for inventory control. Some of the key challenges overcome included complex Prisma schema design for multi-location stock movements, robust type safety, and debugging deployment pipeline intricacies on Vercel.
