# Farm2Door Frontend Architecture

## STACK

- React + Vite
- TailwindCSS
- Zustand
- Axios
- React Router
- Socket.IO Client
- shadcn/ui

---

# APPLICATION MODULES

## Authentication
- JWT-based auth
- role-based access
- protected routes
- auth persistence
- axios interceptor token injection

Roles:
- BUYER
- FARMER
- DELIVERY
- ADMIN

---

# CORE MODULES

## Listings
Features:
- listing cards
- listing details
- listing creation
- listing editing
- image uploads
- filters/search

Backend routes:
- /api/listings

---

## Negotiations
Features:
- offer creation
- counter offers
- negotiation timeline
- accept/reject flow

Backend routes:
- /api/negotiations

---

## Orders & Payments
Features:
- order summary
- Razorpay integration
- payment verification
- escrow states

Backend routes:
- /api/payments

---

## Delivery
Features:
- delivery dashboard
- real-time location tracking
- OTP verification
- delivery status updates

Backend:
- Socket.IO
- /api/delivery

Socket Events:
- joinDeliveryRoom
- delivery:location:update

---

## Disputes
Features:
- raise dispute
- dispute tracking
- admin resolution

Backend routes:
- /api/disputes

---

# STATE MANAGEMENT

## Zustand Stores

Expected stores:
- authStore
- listingStore
- negotiationStore
- deliveryStore
- paymentStore

Rules:
- keep stores modular
- avoid duplicated state
- avoid massive monolithic stores

---

# API LAYER

Structure:
- centralized axios client
- interceptors
- token injection
- unified error handling

Rules:
- no direct fetch calls
- no scattered axios instances

---

# ROUTING

Expected route groups:
- public routes
- authenticated routes
- role-protected routes

Examples:
- /login
- /register
- /buyer/*
- /farmer/*
- /delivery/*
- /admin/*

---

# SOCKET ARCHITECTURE

Requirements:
- authenticated socket connection
- reconnect handling
- listener cleanup
- room joining
- prevent duplicate listeners

---

# UI DESIGN SYSTEM

Design Style:
- clean SaaS dashboard
- modern cards
- responsive layouts
- soft shadows
- minimal color palette
- consistent spacing

Responsive:
- mobile-first
- tablet support
- desktop optimized

---

# FRONTEND GOAL

Frontend must:
- integrate cleanly with backend
- be production-oriented
- support scalability
- support future enhancements
- remain presentation-ready