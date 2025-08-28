# 🏥 Blood Test Report Management System

A comprehensive healthcare management solution for managing blood test reports, patients, and medical data with a modern web interface.

## ✨ Features

### 🔐 Authentication & User Management
- **JWT-based authentication** with secure token management
- **Role-based access control** (Admin & Patient roles)
- **User registration and login** with email/phone support
- **Password hashing** using bcrypt for security

### 🩸 Blood Report Management
- **Create and manage blood reports** with comprehensive test data
- **Patient information management** with detailed profiles
- **Test result tracking** with normal ranges and abnormal flags
- **PDF generation** for professional report output
- **Report preview** before saving/downloading

### 📊 Dashboard & Analytics
- **Real-time statistics** (today, month, year)
- **Interactive charts** showing trends and distributions
- **Patient demographics** analysis
- **Report status tracking** and management

### 🔍 Advanced Features
- **Search and filtering** for patients and reports
- **Pagination** for large datasets
- **Date range filtering** for reports
- **Bulk operations** for efficient management
- **Responsive design** for all devices

## 🛠️ Technology Stack

### Backend
- **Node.js** with Express.js framework
- **PostgreSQL** database with Sequelize ORM
- **JWT** for authentication
- **bcrypt** for password hashing
- **PDFKit** for PDF generation
- **Express Validator** for input validation

### Frontend
- **React.js** with modern hooks
- **React Router** for navigation
- **Tailwind CSS** for styling
- **Recharts** for data visualization
- **React Hook Form** for form management
- **Axios** for API communication

## 📁 Project Structure

```
blood-report-management-system/
├── config/
│   └── database.js          # Database configuration
├── controllers/             # Route controllers
│   ├── authController.js
│   ├── patientController.js
│   ├── bloodReportController.js
│   └── dashboardController.js
├── middleware/              # Custom middleware
│   ├── auth.js             # JWT authentication
│   └── validation.js       # Input validation
├── models/                  # Database models
│   ├── User.js
│   ├── Patient.js
│   ├── BloodReport.js
│   ├── BloodReportTest.js
│   └── index.js            # Model associations
├── routes/                  # API routes
│   ├── authRoutes.js
│   ├── patientRoutes.js
│   ├── bloodReportRoutes.js
│   ├── dashboardRoutes.js
│   └── userRoutes.js
├── services/                # Business logic
│   ├── authService.js
│   ├── patientService.js
│   ├── bloodReportService.js
│   └── dashboardService.js
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── contexts/        # React contexts
│   │   ├── pages/           # Page components
│   │   ├── services/        # API services
│   │   └── index.js         # App entry point
│   ├── package.json
│   └── tailwind.config.js
├── server.js                # Main server file
├── package.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **npm** or **yarn**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd blood-report-management-system
```

### 2. Install Dependencies
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Setup
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blood_report_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
```

### 4. Database Setup
```bash
# Create PostgreSQL database
createdb blood_report_db

# The application will auto-create tables on first run
# using sequelize.sync({ alter: true })
```

### 5. Start the Application
```bash
# Start backend server (development mode)
npm run dev

# In another terminal, start frontend
npm run client

# Or start both together
npm run dev        # Backend
npm run client     # Frontend
```

The application will be available at:
- **Backend API**: http://localhost:5000
- **Frontend**: http://localhost:3000

## 🔑 Default Users

After starting the application, you can create users through the registration endpoint or directly in the database:

### Admin User
```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "phone": "1234567890",
  "password": "password123",
  "role": "admin"
}
```

### Patient User
```json
{
  "name": "Patient User",
  "email": "patient@example.com",
  "phone": "0987654321",
  "password": "password123",
  "role": "patient"
}
```

## 📚 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/change-password` - Change password

### Patients
- `GET /api/patients` - List patients (with pagination & filters)
- `POST /api/patients` - Create new patient (admin only)
- `GET /api/patients/:id` - Get patient details
- `PUT /api/patients/:id` - Update patient (admin only)
- `DELETE /api/patients/:id` - Delete patient (admin only)
- `GET /api/patients/search?q=query` - Search patients

### Blood Reports
- `GET /api/blood-reports` - List reports (with pagination & filters)
- `POST /api/blood-reports` - Create new report (admin only)
- `GET /api/blood-reports/:id` - Get report details
- `PUT /api/blood-reports/:id` - Update report (admin only)
- `DELETE /api/blood-reports/:id` - Delete report (admin only)
- `GET /api/blood-reports/:id/preview` - Preview report
- `GET /api/blood-reports/:id/pdf` - Download PDF
- `GET /api/blood-reports/stats` - Get report statistics

### Dashboard
- `GET /api/dashboard/stats` - Main dashboard statistics
- `GET /api/dashboard/monthly-trend` - Monthly trend data
- `GET /api/dashboard/gender-distribution` - Gender distribution
- `GET /api/dashboard/age-group-distribution` - Age group analysis

## 🎨 Frontend Features

### Responsive Design
- **Mobile-first approach** with Tailwind CSS
- **Responsive navigation** with collapsible sidebar
- **Touch-friendly interface** for mobile devices

### Modern UI Components
- **Interactive charts** using Recharts
- **Form validation** with React Hook Form
- **Toast notifications** for user feedback
- **Loading states** and error handling

### User Experience
- **Protected routes** based on user roles
- **Automatic token refresh** and error handling
- **Search and filtering** capabilities
- **Pagination** for large datasets

## 🔒 Security Features

- **JWT token authentication** with expiration
- **Password hashing** using bcrypt
- **Input validation** and sanitization
- **Role-based access control**
- **CORS configuration** for security
- **Rate limiting** to prevent abuse
- **Helmet.js** for security headers

## 📊 Database Schema

### Users Table
- `id`, `name`, `email`, `phone`, `password`, `role`, `isActive`, `createdAt`, `updatedAt`

### Patients Table
- `id`, `name`, `age`, `gender`, `phone`, `email`, `address`, `emergencyContact`, `emergencyPhone`, `medicalHistory`, `isActive`, `createdAt`, `updatedAt`

### Blood Reports Table
- `id`, `reportNumber`, `patientId`, `reportDate`, `doctorNotes`, `status`, `isActive`, `createdAt`, `updatedAt`

### Blood Report Tests Table
- `id`, `reportId`, `testName`, `resultValue`, `unit`, `normalRange`, `isAbnormal`, `referenceValue`, `notes`

## 🚀 Deployment

### Production Build
```bash
# Build frontend
cd client
npm run build
cd ..

# Start production server
npm start
```

### Environment Variables for Production
```bash
NODE_ENV=production
PORT=5000
DB_HOST=your_production_db_host
DB_PORT=5432
DB_NAME=your_production_db_name
DB_USER=your_production_db_user
DB_PASSWORD=your_production_db_password
JWT_SECRET=your_strong_jwt_secret
CORS_ORIGIN=https://yourdomain.com
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/yourusername/blood-report-management-system/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔮 Future Enhancements

- **Email notifications** for report completion
- **Mobile app** for patient access
- **Advanced analytics** and reporting
- **Integration** with laboratory equipment
- **Multi-language support**
- **Advanced search** with full-text search
- **API rate limiting** and monitoring
- **Automated backup** and recovery

---

**Built with ❤️ for the healthcare community**


# sindu_hospital
