# Troubleshooting Guide for PassOP

## Save Button Not Working?

Follow these steps to diagnose and fix the issue:

### 1. ✅ Check if MongoDB is Running

Make sure MongoDB is installed and running on your system:

**Windows:**
```bash
# Check if MongoDB service is running
net start | findstr MongoDB

# If not running, start it
net start MongoDB
```

**Mac/Linux:**
```bash
# Check if MongoDB is running
ps aux | grep mongod

# Start MongoDB
brew services start mongodb-community  # Mac
sudo systemctl start mongod            # Linux
```

### 2. ✅ Check if Backend Server is Running

The backend must be running for save to work:

```bash
cd passop-mongo
npm run backend
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:3000
```

### 3. ✅ Check if Frontend is Running

In a separate terminal:

```bash
cd passop-mongo
npm run dev
```

### 4. ✅ Run Both Together

Or run both frontend and backend together:

```bash
cd passop-mongo
npm run start:all
```

### 5. 🔍 Check Browser Console

Open browser DevTools (F12) and check the Console tab for errors:
- ❌ `Failed to fetch` → Backend is not running
- ❌ `CORS error` → Backend CORS is not configured (should be fixed)
- ❌ `Network error` → Check if backend is on port 3000

### 6. 🔍 Check Backend Logs

Look at the terminal where backend is running:
- ❌ `MongoDB connection error` → MongoDB is not running
- ❌ `MONGO_URI is not defined` → .env file issue

### 7. ✅ Verify Environment Variables

Check `passop-mongo/backend/.env`:
```
MONGO_URI=mongodb://localhost:27017
DB_NAME=passop
```

### 8. 🧪 Test Backend Directly

Test if backend is responding:

```bash
# Test GET endpoint
curl http://localhost:3000/api/passwords

# Test POST endpoint
curl -X POST http://localhost:3000/api/passwords \
  -H "Content-Type: application/json" \
  -d '{"id":"test123","site":"https://test.com","username":"testuser","password":"testpass"}'
```

## Common Issues & Solutions

### Issue: "Could not save password. Make sure the backend server is running!"

**Solution:** Start the backend server:
```bash
cd passop-mongo
npm run backend
```

### Issue: MongoDB Connection Error

**Solution:** 
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Verify connection: `mongosh` (should connect without errors)

### Issue: Port 3000 Already in Use

**Solution:**
1. Find process using port 3000: `netstat -ano | findstr :3000` (Windows) or `lsof -i :3000` (Mac/Linux)
2. Kill the process or change port in `backend/server.js`

### Issue: CORS Error

**Solution:** Already fixed in the code with `app.use(cors())`

## Need More Help?

1. Check all terminals for error messages
2. Verify MongoDB is installed and running
3. Ensure both frontend (port 5173) and backend (port 3000) are running
4. Check browser console for detailed error messages