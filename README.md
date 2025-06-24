 Wholesale Marketplace Platform

A modern full-stack wholesale marketplace web application where vendors can list products in bulk, customers can place large quantity orders, and admins manage platform activities. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and TypeScript.

## Features

### Authentication
- Login / Register with role-based access (Admin, Vendor, Customer)
- Secure JWT token-based authentication
- Auto-refresh token support
- Blocked users are restricted from login

### Marketplace
- Customers can browse all available products
- Custom pricing per customer (email-based)
- Minimum order quantity and available stock handling
- Add-to-cart 
- Real-time stock availability
- Out-of-stock indication

### Orders
- Place orders per vendor from cart
- View previous orders with status (Shipped, Delivered,Accepted ,Rejected)
- Timezone-aware order timestamps

### Vendor Dashboard
- Vendors can list and manage their own products
- Blocked vendors are restricted from accessing the dashboard

### Admin Dashboard
- View all users and vendors
- Block/Unblock vendors and users
- Monitor all orders

### Toast Notifications
- Realtime feedback for user actions (add to cart, block, place order, etc.)

---

##  Tech Stack

| Frontend | Backend | Database | Auth |
|----------|---------|----------|------|
| React + TypeScript | Node.js + Express.js | MongoDB | JWT (access + refresh token) |

Additional:
- Redux Toolkit for auth state
- Axios with interceptors
- Tailwind CSS for UI
- React Router for navigation
- Toastify for alerts
- Security to document the usage of helmet and cors

