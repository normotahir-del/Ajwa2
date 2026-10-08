# AJWA — Customer Ordering + Reception Dashboard

## What is connected
The customer website (`/`) and receptionist dashboard (`/reception`) use the same Express backend and order API.

Customer:
- Browse dry fruits and restaurant menu
- Add items to cart
- Submit name, phone, delivery/pickup and address
- Receive an AJWA order number

Reception:
- Open `/reception`
- See incoming orders
- Accept & Prepare
- Mark Ready
- Complete Order
- See order totals and sales

## Run on your computer
Install Node.js, then in this folder:

```bash
npm install
npm start
```

Open:
- Customer: http://localhost:3000
- Reception: http://localhost:3000/reception

## GitHub
Upload the whole project to a GitHub repository. GitHub stores the code, but GitHub Pages cannot run the Node/Express backend.

For a live version, deploy this same repository to a Node-compatible host (Render, Railway, Fly.io, VPS, etc.). The frontend and backend will then remain connected because the browser calls `/api/orders` on the same server.

## Production requirements
Before taking real customer orders:
1. Replace the JSON file with a hosted database (PostgreSQL/Supabase/etc.).
2. Add receptionist authentication.
3. Use HTTPS.
4. Add real-time push notifications/WebSockets.
5. Add backups and server-side validation.
6. Add payment processing if online payment is required.

This package is a connected working prototype, not a production payment system.
