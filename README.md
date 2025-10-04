# CSE 340 Project

## 🎓 Instructions for Graders

### Quick Start Guide

#### Option 1: Use Pre-created Admin Account
```
Email: admin@cse340.net
Password: I@mAn@dmin
```
1. Go to http://localhost:3000/account/login
2. Enter the credentials above
3. Access inventory management at http://localhost:3000/inv

#### Option 2: Create Your Own Account with Special Access
1. Go to http://localhost:3000/account/register
2. Fill out the registration form
3. Use one of these special access codes:
   - For Employee access: `EmplCode340`
   - For Admin access: `AdminCode340`
4. Submit and log in

### Features Available After Login
- ✅ View Vehicle Management Dashboard
- ✅ Add New Vehicle Classifications
- ✅ Add New Vehicles to Inventory
- ✅ Edit Existing Vehicles
- ✅ Delete Vehicles

### Database Setup
The database includes a pre-configured admin account and all necessary tables for testing.

### Troubleshooting
If you encounter any issues:
1. Ensure the database is properly set up
2. Clear browser cookies and cache
3. Try registering with the admin code: `AdminCode340`

### Need Help?
The instructions are visible in three places:
1. This README file
2. The registration page has a detailed instruction box
3. The login page shows access options

For additional assistance, please contact the student or instructor.

### Features Available to Admin Users:
1. Vehicle Management (/inv)
2. Add New Classification (/inv/add-classification)
3. Add New Vehicle (/inv/add-inventory)
4. Edit/Delete Vehicles

### Database Setup
The database includes a default admin account for testing and grading purposes. This account is automatically created when you run the `dbcse340.sql` file.

### Steps to Test Admin Features:
1. Start the application
2. Go to http://localhost:3000/account/login
3. Log in with the admin credentials above
4. Access inventory management at http://localhost:3000/inv
5. Test adding classifications and vehicles