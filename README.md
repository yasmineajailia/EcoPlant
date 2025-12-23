# Plant Nursery (Pépinière) E-Commerce Website

A full-stack plant nursery e-commerce website built with React and Node.js.

## 🌿 Features

### Front Office (Customer Side)
- **Home Page**: Featured plants and current promotions
- **Plant Catalog**: Browse all plants with advanced filtering
  - Filter by category (indoor/outdoor/succulent/flower/tree/herb)
  - Filter by size (small/medium/large)
  - Filter by price range
  - Search by name
- **Plant Details**: Detailed plant information with image gallery
- **Shopping Cart**: Add/remove items, update quantities
- **Checkout**: Delivery information and order confirmation
- **User Account**: 
  - Registration and login
  - Profile management
  - Order history

### Back Office (Admin Side)
- **Admin Dashboard**: Statistics and recent orders overview
- **Plant Management**:
  - Add new plants
  - Edit existing plants
  - Delete plants
  - Upload multiple images per plant
  - Mark plants as featured or on promotion
- **Order Management**:
  - View all orders
  - Update order status (Pending → Preparing → Shipped → Delivered)
  - Manage delivery information
  - Assign delivery drivers

## 🛠️ Tech Stack

### Frontend
- **React** (v18.2.0)
- **React Router** (v6.20.0) - Routing
- **Axios** (v1.6.2) - HTTP requests
- **Context API** - State management (Auth & Cart)

### Backend
- **Node.js** & **Express** (v4.18.2)
- **MongoDB** & **Mongoose** (v8.0.0) - Database
- **JWT** (jsonwebtoken v9.0.2) - Authentication
- **Bcrypt** (bcryptjs v2.4.3) - Password hashing
- **Multer** (v1.4.5) - File uploads
- **CORS** (v2.8.5) - Cross-origin requests

## 📁 Project Structure

```
Pépinière/
├── client/                    # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── Header.js
│   │   │   ├── Footer.js
│   │   │   ├── PlantCard.js
│   │   │   ├── PrivateRoute.js
│   │   │   └── AdminRoute.js
│   │   ├── context/           # React context
│   │   │   ├── AuthContext.js
│   │   │   └── CartContext.js
│   │   ├── pages/             # Page components
│   │   │   ├── Home.js
│   │   │   ├── PlantCatalog.js
│   │   │   ├── PlantDetails.js
│   │   │   ├── Cart.js
│   │   │   ├── Checkout.js
│   │   │   ├── OrderConfirmation.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Profile.js
│   │   │   ├── OrderHistory.js
│   │   │   └── admin/
│   │   │       ├── Dashboard.js
│   │   │       ├── Plants.js
│   │   │       └── Orders.js
│   │   ├── utils/
│   │   │   └── api.js         # Axios configuration
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   └── package.json
│
├── server/                    # Express backend
│   ├── controllers/           # Route controllers
│   │   ├── plantController.js
│   │   ├── userController.js
│   │   └── orderController.js
│   ├── middleware/            # Custom middleware
│   │   ├── auth.js           # JWT authentication
│   │   └── upload.js         # File upload (Multer)
│   ├── models/               # Mongoose models
│   │   ├── Plant.js
│   │   ├── User.js
│   │   └── Order.js
│   ├── routes/               # API routes
│   │   ├── plantRoutes.js
│   │   ├── userRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   ├── uploads/              # Uploaded images
│   │   └── plants/
│   ├── .env.example          # Environment variables template
│   ├── server.js             # Entry point
│   └── package.json
│
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable) or navigate to the project folder:
```bash
cd Pépinière
```

2. **Install server dependencies**:
```bash
cd server
npm install
```

3. **Install client dependencies**:
```bash
cd ../client
npm install
```

4. **Configure environment variables**:

Create a `.env` file in the `server` directory (copy from `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pepiniere
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

Update the values according to your setup:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string for JWT signing

5. **Create uploads directory**:
```bash
cd server
mkdir -p uploads/plants
```

### Running the Application

1. **Start MongoDB** (if running locally):
```bash
mongod
```

2. **Start the backend server** (from the `server` directory):
```bash
npm run dev
# or
npm start
```

The server will run on `http://localhost:5000`

3. **Start the frontend** (from the `client` directory, in a new terminal):
```bash
npm start
```

The client will run on `http://localhost:3000`

## 👤 User Roles

### Regular User
- Browse plants
- Add items to cart
- Place orders
- View order history
- Manage profile

### Admin User
- All user capabilities
- Access admin dashboard
- Manage plants (CRUD operations)
- Manage orders
- Update order and delivery status

### Creating an Admin User
To create an admin user, you need to manually set the `role` field to `'admin'` in the database:

```javascript
// Using MongoDB shell or Compass
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { role: "admin" } }
)
```

Or register a user normally and then update their role in the database.

## 📡 API Endpoints

### Public Routes
- `GET /api/plants` - Get all plants (with filters)
- `GET /api/plants/featured` - Get featured plants
- `GET /api/plants/promotions` - Get promotional plants
- `GET /api/plants/:id` - Get single plant
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Protected Routes (Require Authentication)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get single order

### Admin Routes (Require Admin Role)
- `GET /api/admin/dashboard` - Get dashboard statistics
- `POST /api/admin/plants` - Create plant (with image upload)
- `PUT /api/admin/plants/:id` - Update plant
- `DELETE /api/admin/plants/:id` - Delete plant
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id/status` - Update order status
- `PUT /api/admin/orders/:id/delivery` - Update delivery status

## 🎨 Design Features

- **Responsive Design**: Mobile-friendly interface
- **Modern UI**: Clean and intuitive user interface
- **Color Scheme**: Green-themed to match the plant nursery concept
- **Loading States**: Spinners for async operations
- **Error Handling**: User-friendly error messages
- **Form Validation**: Client and server-side validation

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes (private and admin)
- Input validation
- CORS configuration
- File upload restrictions (image types and size limits)

## 📦 Database Models

### Plant
- name, description, price
- category (indoor/outdoor/succulent/flower/tree/herb/other)
- size (small/medium/large)
- stock, images
- featured, onPromotion, promotionPrice

### User
- firstName, lastName, email, password
- phone, address
- role (user/admin)

### Order
- user, orderItems[]
- deliveryInfo (name, phone, address)
- totalPrice
- orderStatus (pending/preparing/shipped/delivered/cancelled)
- deliveryStatus (not-assigned/assigned/in-transit/delivered)
- deliveryDriver, deliveryNotes

## 🤝 Contributing

This is a complete e-commerce application. Feel free to:
- Add more features (payment integration, reviews, etc.)
- Improve the UI/UX
- Add more filtering options
- Implement search functionality
- Add email notifications

## 📝 License

This project is open source and available for educational purposes.

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check your `MONGODB_URI` in `.env`
- Verify network connectivity

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using that port

### Image Upload Issues
- Ensure the `uploads/plants` directory exists
- Check file permissions
- Verify file size and type restrictions

## 📧 Contact

For questions or support, please create an issue in the repository.

---

**Built with ❤️ using React and Node.js**
