// backend/models/Agent.js
const mongoose = require('mongoose');

const agentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    status: { type: String, default: 'idle' },
    tasks: { type: Number, default: 0 },
    successRate: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Agent', agentSchema);
