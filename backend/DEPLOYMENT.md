# 🚀 Deployment Guide - Stackenzo Backend

## Production Deployment Options

### Option 1: VPS Deployment (Recommended)

#### Providers
- DigitalOcean ($5-10/month)
- AWS EC2 (Free tier available)
- Linode ($5/month)
- Vultr ($5/month)

#### Steps

1. **Setup Server**
```bash
# SSH into server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install MySQL
apt install -y mysql-server

# Install PM2 (Process Manager)
npm install -g pm2
```

2. **Configure MySQL**
```bash
# Secure MySQL
mysql_secure_installation

# Create database
mysql -u root -p
CREATE DATABASE stackenzo_db;
CREATE USER 'stackenzo'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON stackenzo_db.* TO 'stackenzo'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

3. **Deploy Application**
```bash
# Clone repository
git clone your-repo-url
cd backend

# Install dependencies
npm install --production

# Setup environment
cp .env.example .env
nano .env  # Edit with production values

# Initialize database
npm run init-db

# Start with PM2
pm2 start src/server.js --name stackenzo-api
pm2 save
pm2 startup
```

4. **Setup Nginx (Reverse Proxy)**
```bash
# Install Nginx
apt install -y nginx

# Configure
nano /etc/nginx/sites-available/stackenzo-api
```

```nginx
server {
    listen 80;
    server_name api.stackenzo.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/stackenzo-api /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

5. **Setup SSL (Let's Encrypt)**
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d api.stackenzo.com
```

---

### Option 2: Heroku Deployment

1. **Install Heroku CLI**
```bash
npm install -g heroku
heroku login
```

2. **Create Heroku App**
```bash
cd backend
heroku create stackenzo-api

# Add MySQL addon
heroku addons:create jawsdb:kitefin

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret
heroku config:set EMAIL_USER=your_email
heroku config:set EMAIL_PASSWORD=your_password
```

3. **Deploy**
```bash
git init
git add .
git commit -m "Initial commit"
git push heroku main

# Initialize database
heroku run npm run init-db
```

---

### Option 3: Railway Deployment

1. **Connect Repository**
- Go to railway.app
- Connect GitHub repository
- Select backend folder

2. **Configure**
- Add MySQL database
- Set environment variables
- Deploy automatically

---

### Option 4: Render Deployment

1. **Create Web Service**
- Go to render.com
- Connect repository
- Select backend folder

2. **Configure**
```yaml
# render.yaml
services:
  - type: web
    name: stackenzo-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: DB_HOST
        fromDatabase:
          name: stackenzo-db
          property: host
```

---

## Environment Configuration

### Production .env
```env
NODE_ENV=production
PORT=3000

# Database (Use managed database)
DB_HOST=your-db-host.com
DB_USER=stackenzo_user
DB_PASSWORD=strong_secure_password
DB_NAME=stackenzo_db
DB_PORT=3306

# JWT
JWT_SECRET=very_long_random_string_min_32_chars

# Email (Use SendGrid or AWS SES in production)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key

# Frontend
FRONTEND_URL=https://stackenzo.com

# Admin
ADMIN_EMAIL=admin@stackenzo.com
```

---

## Database Hosting

### Option 1: Managed MySQL
**DigitalOcean Managed Database** ($15/month)
- Automatic backups
- High availability
- Monitoring included

**AWS RDS** (Pay as you go)
- Scalable
- Automated backups
- Multi-AZ deployment

**PlanetScale** (Free tier available)
- Serverless MySQL
- Automatic scaling
- Built-in branching

### Option 2: Self-Hosted
```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mysqldump -u stackenzo -p stackenzo_db > backup_$DATE.sql
# Upload to S3 or similar
```

---

## Email Service Setup

### Option 1: SendGrid (Recommended)
```bash
# Install
npm install @sendgrid/mail

# Configure
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key
```

### Option 2: AWS SES
```bash
EMAIL_HOST=email-smtp.us-east-1.amazonaws.com
EMAIL_PORT=587
EMAIL_USER=your_aws_access_key
EMAIL_PASSWORD=your_aws_secret_key
```

### Option 3: Gmail (Development Only)
```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=app_specific_password
```

---

## Security Hardening

### 1. Environment Variables
```bash
# Never commit .env
echo ".env" >> .gitignore

# Use secrets management
# - AWS Secrets Manager
# - HashiCorp Vault
# - Heroku Config Vars
```

### 2. Rate Limiting
```javascript
// Install
npm install express-rate-limit

// Add to app.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Helmet (Security Headers)
```javascript
npm install helmet

const helmet = require('helmet');
app.use(helmet());
```

### 4. HTTPS Only
```javascript
// Force HTTPS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

---

## Monitoring & Logging

### Option 1: PM2 Monitoring
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# View logs
pm2 logs stackenzo-api
pm2 monit
```

### Option 2: External Services
- **Sentry** - Error tracking
- **LogRocket** - Session replay
- **DataDog** - Full monitoring
- **New Relic** - APM

### Setup Sentry
```bash
npm install @sentry/node

// In app.js
const Sentry = require('@sentry/node');
Sentry.init({ dsn: process.env.SENTRY_DSN });
```

---

## Backup Strategy

### Database Backups
```bash
# Daily backup cron job
0 2 * * * /usr/bin/mysqldump -u stackenzo -p'password' stackenzo_db | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz

# Keep last 7 days
find /backups -name "db_*.sql.gz" -mtime +7 -delete
```

### Application Backups
```bash
# Backup code and configs
tar -czf app_backup_$(date +%Y%m%d).tar.gz /var/www/stackenzo-api
```

---

## Performance Optimization

### 1. Database Indexing
```sql
-- Already included in schema
CREATE INDEX idx_email ON contact_submissions(email);
CREATE INDEX idx_status ON contact_submissions(status);
```

### 2. Connection Pooling
```javascript
// Already configured in database.js
connectionLimit: 10
```

### 3. Caching (Optional)
```bash
npm install redis

// Cache frequent queries
const redis = require('redis');
const client = redis.createClient();
```

### 4. Compression
```bash
npm install compression

const compression = require('compression');
app.use(compression());
```

---

## CI/CD Pipeline

### GitHub Actions
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.HOST }}
          username: ${{ secrets.USERNAME }}
          key: ${{ secrets.SSH_KEY }}
          script: |
            cd /var/www/stackenzo-api
            git pull
            npm install
            pm2 restart stackenzo-api
```

---

## Health Checks

### Uptime Monitoring
- **UptimeRobot** (Free)
- **Pingdom**
- **StatusCake**

### Endpoint
```javascript
// Already included in app.js
GET /health

Response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
```bash
# Check MySQL is running
systemctl status mysql

# Check credentials
mysql -u stackenzo -p

# Check firewall
ufw allow 3306
```

2. **Port Already in Use**
```bash
# Find process
lsof -i :3000

# Kill process
kill -9 PID
```

3. **PM2 Not Starting**
```bash
# Check logs
pm2 logs stackenzo-api --lines 100

# Restart
pm2 restart stackenzo-api
```

4. **Email Not Sending**
```bash
# Test SMTP
telnet smtp.gmail.com 587

# Check credentials
# Verify firewall allows port 587
```

---

## Cost Estimation

### Minimal Setup ($15-20/month)
- VPS: $5/month (DigitalOcean)
- Managed MySQL: $15/month
- Domain: $12/year
- SSL: Free (Let's Encrypt)

### Recommended Setup ($50-70/month)
- VPS: $10/month (2GB RAM)
- Managed MySQL: $25/month
- SendGrid: $15/month (40k emails)
- Monitoring: $10/month
- Backups: $5/month

### Enterprise Setup ($200+/month)
- Load Balancer: $20/month
- Multiple servers: $50/month
- Database cluster: $100/month
- CDN: $20/month
- Advanced monitoring: $50/month

---

## Post-Deployment Checklist

- [ ] Database initialized
- [ ] Environment variables set
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Email service working
- [ ] Backups configured
- [ ] Monitoring setup
- [ ] Health checks passing
- [ ] API endpoints tested
- [ ] Frontend connected
- [ ] Error tracking enabled
- [ ] Documentation updated

---

## Support

For deployment issues:
1. Check server logs
2. Verify environment variables
3. Test database connection
4. Review Nginx/Apache logs
5. Contact hosting support

---

## Next Steps After Deployment

1. **Test all endpoints** in production
2. **Monitor performance** for first week
3. **Setup alerts** for downtime
4. **Document** any custom configurations
5. **Train team** on deployment process
6. **Plan** for scaling as traffic grows

---

**Deployment Complete! 🎉**

Your Stackenzo backend is now live and ready to serve the frontend application.
