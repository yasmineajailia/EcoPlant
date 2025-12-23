# 🚀 Quick Start Guide - Pépinière E-Commerce

## ⚡ Fast Setup (5 minutes)

### 1️⃣ Prerequisites Check
- ✅ Node.js installed (v14+)
- ✅ MongoDB installed and running
- ✅ npm installed

### 2️⃣ Start MongoDB
Open a terminal and run:
```bash
mongod
```
Keep this terminal open!

### 3️⃣ Configure Environment Variables

The `.env` files have been created for you. Update them if needed:

**server/.env:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pepiniere
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

**client/.env:**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 4️⃣ Start the Backend Server

Open a new terminal in the project folder:
```bash
cd server
npm run dev
```

You should see:
```
✅ MongoDB Connected
🚀 Server running on port 5000
```

Keep this terminal open!

### 5️⃣ Start the Frontend

Open another new terminal in the project folder:
```bash
cd client
npm start
```

The browser should automatically open at `http://localhost:3000`

## 🎉 You're Done!

### What You Can Do Now:

1. **Browse as a customer:**
   - View the home page
   - Browse the plant catalog
   - Register an account
   - Add plants to cart (once plants are added by admin)

2. **Access admin features:**
   - Register a user first
   - Then manually set their role to 'admin' in MongoDB
   - Access admin dashboard at `/admin`
   - Add plants with images
   - Manage orders

## 📝 Creating Your First Admin User

### Option 1: MongoDB Shell
```bash
mongosh
use pepiniere
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } }
)
```

### Option 2: MongoDB Compass
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Open the `pepiniere` database
4. Open the `users` collection
5. Find your user and edit the document
6. Change `role` from `"user"` to `"admin"`
7. Save

## 🛠️ Troubleshooting

### MongoDB Connection Error
```
❌ MongoDB Connection Error
```
**Solution:** Make sure MongoDB is running (`mongod` command)

### Port Already in Use
```
Error: Port 3000 is already in use
```
**Solution:** Close other apps using port 3000, or change the port

### Cannot Find Module
```
Error: Cannot find module
```
**Solution:** 
```bash
cd client
npm install
# or
cd server
npm install
```

## 📂 Project Structure

```
Pépinière/
├── client/          # React frontend (Port 3000)
├── server/          # Express backend (Port 5000)
└── README.md        # Full documentation
```

## 🔗 Important URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000/api
- **Admin Dashboard:** http://localhost:3000/admin (after login as admin)

## 📱 Features Overview

### Customer Features:
- ✨ Browse plant catalog with filters
- 🛒 Shopping cart
- 📦 Place orders with delivery info
- 👤 User profile and order history

### Admin Features:
- 📊 Dashboard with statistics
- 🌱 Add/Edit/Delete plants
- 🖼️ Upload plant images
- 📦 Manage orders and deliveries
- 🚚 Update order and delivery status

## 💡 Tips

1. **Add some test plants** through the admin interface first
2. **Use different browsers** for testing customer and admin views simultaneously
3. **Check MongoDB** for data persistence
4. **Read the full README.md** for detailed API documentation

## 🎨 Default Categories

When adding plants, you can use these categories:
- indoor (Intérieur)
- outdoor (Extérieur)
- succulent (Succulente)
- flower (Fleur)
- tree (Arbre)
- herb (Herbe)
- other (Autre)

## 🏷️ Promotion Feature

Mark plants as "featured" or "on promotion" in the admin panel to display them on the home page!

---

**Need Help?** Check the full [README.md](README.md) for detailed documentation!

**Happy Coding! 🌿**
