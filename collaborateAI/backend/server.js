// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname + '/../frontend'));

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/collaborateAI';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ Mongo Error:", err));

// Models
const Agent = require('./models/Agent');
const Project = require('./models/Project');

// Routes
app.get('/api/agents', async (req, res) => {
    try {
        const agents = await Agent.find();
        res.json(agents);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/agents', async (req, res) => {
    try {
        const agent = new Agent(req.body);
        await agent.save();
        res.json(agent);
        io.emit('update-agent-status', agent);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.post('/api/projects', async (req, res) => {
    try {
        const project = new (require('./models/Project'))(req.body);
        await project.save();
        res.json(project);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Serve frontend for any other route (SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/../frontend/index.html');
});

// Socket.io events for live collaboration
io.on('connection', (socket) => {
    console.log('🟢 User Connected:', socket.id);

    socket.on('agent-status-update', (data) => {
        // broadcast update to all clients
        io.emit('update-agent-status', data);
    });

    socket.on('disconnect', () => {
        console.log('🔴 User Disconnected:', socket.id);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
