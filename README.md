# 🌙 NightVibe — Night Club Booking & Transport Management System

A full-stack, production-ready platform for nightclub bookings, transport scheduling, payments, and admin management.

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express.js, JWT Auth |
| Database | PostgreSQL (Sequelize ORM) |
| Payments | Razorpay (UPI, Card, Wallet) |
| Notifications | Twilio WhatsApp API |
| File Export | ExcelJS |

## 📁 Project Structure

```
nightclub/
├── frontend/     # React app
├── backend/      # Node.js API
├── database/     # SQL schemas
└── docker-compose.yml
```

## 🔧 Quick Start

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend && npm install && cp .env.example .env && npm run dev
```

## 🌟 Features
- Multi-step booking flow
- Transport booking (Cab/Bike)
- Razorpay payment gateway
- WhatsApp confirmations
- Auto Excel export
- JWT role authentication
- Admin dashboards
- Mobile-first design
