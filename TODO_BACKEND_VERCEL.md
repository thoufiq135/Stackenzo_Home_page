# Backend Vercel Deployment TODO

## Plan Steps:
- [x] 1. Create `backend/vercel.json` with Node.js serverless config
- [x] 2. Update `backend/server.js`: Fix dotenv, remove frontend serving
- [x] 3. Update `backend/src/config/initDatabase.js`: Remove dotenv
- [ ] 4. Test locally: `cd backend && npm install && npm start`
- [ ] 5. Deploy: `cd backend && vercel --prod`
- [ ] 6. Add env vars in Vercel dashboard: MONGODB_URI, FRONTEND_URL
- [ ] 7. Test /api/health endpoint
- [ ] 8. Update client to use Vercel backend URL

**Current Progress: Code changes complete (steps 1-3). Ready for testing/deployment.**
