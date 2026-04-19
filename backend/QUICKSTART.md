# 🚀 Quick Start Guide - Stackenzo Backend

## Step-by-Step Setup (5 minutes)

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
# Copy the example file
copy .env.example .env

# Edit .env with your MySQL credentials
# Minimum required:
# DB_PASSWORD=your_mysql_password
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASSWORD=your_gmail_app_password
```

### 3. Setup Database
```bash
npm run init-db
```

### 4. Start Server
```bash
npm run dev
```

Server will start at: `http://localhost:3000`

### 5. Test the API
```bash
# Health check
curl http://localhost:3000/health

# Test contact form
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"test@test.com\",\"subject\":\"Test\",\"message\":\"Hello\"}"
```

## ✅ Verification Checklist

- [ ] Dependencies installed
- [ ] .env file configured
- [ ] MySQL running
- [ ] Database initialized
- [ ] Server started successfully
- [ ] Health check returns 200
- [ ] Test API call works

## 🔧 Common Issues

### Database Connection Failed
- Check MySQL is running
- Verify DB_PASSWORD in .env
- Ensure MySQL port is 3306

### Email Not Sending
- Use Gmail App Password (not regular password)
- Enable 2FA on Gmail
- Check EMAIL_USER and EMAIL_PASSWORD

### Port Already in Use
- Change PORT in .env
- Or kill process: `npx kill-port 3000`

## 📡 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact` | Submit contact form |
| POST | `/api/enrollments` | Submit enrollment |
| GET | `/api/jobs/postings` | Get job listings |
| POST | `/api/jobs/applications` | Apply for job |
| POST | `/api/newsletter/subscribe` | Subscribe to newsletter |

## 🎯 Next Steps

1. Test all endpoints with Postman
2. Connect frontend to backend
3. Add authentication for admin routes
4. Deploy to production server

## 📞 Need Help?

Check the main README.md for detailed documentation.
