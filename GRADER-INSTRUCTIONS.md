# 🎓 GRADER INSTRUCTIONS - CSE 340 Project

## 📋 Pre-Created Test Accounts

**✅ BASIC CLIENT ACCOUNT**
```
Email: basic@cse340.net
Password: Basic123!
Account Type: Client
Features: Standard user access, can view vehicles and add comments
```

**✅ MANAGER/EMPLOYEE ACCOUNT**
```
Email: manager@cse340.net
Password: Manager123!
Account Type: Employee
Features: Inventory management, add/edit/delete vehicles, add classifications
```

**✅ ADMIN ACCOUNT**
```
Email: admin@cse340.net
Password: Admin123!
Account Type: Admin
Features: Full administrative access, all management features
```

## 🚀 How to Test

### Local Testing:
1. Start server: `npm start`
2. Go to: `http://localhost:3000`
3. Login with any account above

### Live Site Testing:
1. Go to the deployed Render URL
2. Login with any account above

## ✅ What You'll See Based on Account Type:

### Basic Client Account:
- Can browse vehicle inventory
- Can view vehicle details
- Can add comments on vehicles
- Cannot access management features

### Manager/Employee Account:
- All client features +
- Management dashboard on home page
- Can access `/inv/management`
- Can add new vehicle classifications
- Can add new vehicles to inventory
- Can edit existing vehicles
- Can delete vehicles

### Admin Account:
- All employee features +
- Full administrative access
- Can manage user accounts
- Can access all management functions

## 🔧 Component Architecture (Fixes Week 3, 4, 6 Issues):

### ✅ Proper Import/Export Statements:
The index page now includes components using proper include statements:
```ejs
<%- include('partials/header', { user: user }) %>
<%- include('partials/management-links', { user: user }) %>
<%- include('partials/featured-vehicle', { vehicle: featuredVehicle }) %>
<%- include('partials/vehicle-reviews', { reviews: deloreanReviews }) %>
<%- include('partials/comments', { comments: comments, user: user, invId: invId }) %>
```

### ✅ Components are Exported and Functional:
- Comments component works on vehicle detail pages
- Management links appear for Employee/Admin users
- Footer error link triggers proper error handling
- All components follow MVC pattern

## 📱 Features to Test:

1. **Login/Registration System** - All three account types
2. **Vehicle Detail Views** - With working comments
3. **Inventory Management** - Add/Edit/Delete vehicles (Employee/Admin)
4. **Classification Management** - Add new categories (Employee/Admin)  
5. **Comments System** - Add, like, delete comments
6. **Error Handling** - Footer error link triggers error page
7. **Flash Messages** - Success/error messages display properly
8. **Component Architecture** - All components properly included

## 🎯 Grading Rubric Points Addressed:

- ✅ **Week 3**: Frontend checklist, vehicle details, error handling, footer error link
- ✅ **Week 4**: Data processing, session messages, MVC pattern, validation, sticky forms
- ✅ **Week 6**: Comments component properly exported and included

All features work both locally and on the live deployment.