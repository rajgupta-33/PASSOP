const express = require('express')
const dotenv = require('dotenv')
const { MongoClient } = require('mongodb'); 
const bodyparser = require('body-parser')
const cors = require('cors')
const path = require('path')

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '.env') })

// Connecting to the MongoDB Client
const url = process.env.MONGO_URI;
if (!url) {
    console.error('ERROR: MONGO_URI is not defined in .env file');
    process.exit(1);
}

const client = new MongoClient(url);

// Connect with error handling
client.connect()
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1);
    });

// App & Database
const dbName = process.env.DB_NAME || 'passop'
const app = express()
const port = 3000

console.log(`🔧 Using database: ${dbName}`)

// Middleware
app.use(bodyparser.json())
app.use(cors())

// Get all the passwords
app.get('/', async (req, res) => {
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.find({}).toArray();
    res.json(findResult)
})

// Save a password
app.post('/api/passwords', async (req, res) => { 
    const password = req.body
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.insertOne(password);
    res.send({success: true, result: findResult})
})
    
    // GET route to fetch all passwords
    app.get('/api/passwords', async (req, res) => {
        const db = client.db(dbName);
        const collection = db.collection('passwords');
        const findResult = await collection.find({}).toArray();
        res.json(findResult);
    })

// Delete a password by id
app.delete('/api/passwords', async (req, res) => { 
    const { id } = req.body;
    const db = client.db(dbName);
    const collection = db.collection('passwords');
    const findResult = await collection.deleteOne({ id });
    res.send({success: true, result: findResult})
})

app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`)
    console.log(`📊 API endpoints:`)
    console.log(`   GET    http://localhost:${port}/api/passwords`)
    console.log(`   POST   http://localhost:${port}/api/passwords`)
    console.log(`   DELETE http://localhost:${port}/api/passwords`)
})