// frontend/main.js
document.addEventListener('DOMContentLoaded', function() {
    // Populate agent preview from local sample if backend not present
    const agentGrid = document.getElementById('agentGrid');
    const sampleAgents = [
        { name: 'ProjectManager', status: 'working', tasks: 24, successRate: 96.5 },
        { name: 'DepartmentCoordinator', status: 'idle', tasks: 18, successRate: 94.2 },
        { name: 'ResourceAllocator', status: 'working', tasks: 31, successRate: 98.1 },
        { name: 'CommunicationFacilitator', status: 'idle', tasks: 42, successRate: 95.8 }
    ];

    function renderAgents(agents) {
        agentGrid.innerHTML = agents.map(agent => `
            <div class="agent-card">
                <div class="agent-header">
                    <div class="agent-avatar">🤖</div>
                    <div class="agent-info">
                        <h4>${agent.name}</h4>
                        <span class="agent-status">${agent.status}</span>
                        <span class="status-indicator ${agent.status}"></span>
                    </div>
                </div>
                <div class="agent-metrics">
                    <div class="metric">
                        <span class="metric-value">${agent.tasks}</span>
                        <span class="metric-label">Tasks</span>
                    </div>
                    <div class="metric">
                        <span class="metric-value">${agent.successRate}%</span>
                        <span class="metric-label">Success</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Try fetching from backend, otherwise fallback to sample
    fetch('/api/agents').then(res => {
        if (!res.ok) throw new Error('No backend');
        return res.json();
    }).then(agents => {
        renderAgents(agents);
    }).catch(() => {
        renderAgents(sampleAgents);
    });

    // Socket.io connection (will attempt connection if backend running)
    try {
        const socket = io();
        socket.on('connect', () => {
            const statusEl = document.getElementById('connectionStatus');
            if (statusEl) {
                statusEl.textContent = 'Connected';
                statusEl.classList.remove('disconnected');
            }
        });
        socket.on('update-agent-status', data => {
            // simple update: re-render if matching name found
            sampleAgents.forEach(a => { if (a.name === data.name) { a.status = data.status; a.tasks = data.tasks || a.tasks; a.successRate = data.successRate || a.successRate; }});
            renderAgents(sampleAgents);
        });
    } catch (e) {
        // socket.io not available or backend not running
        console.log('Socket not connected', e.message);
    }

    // Simple scroll reveal
    const revealEls = document.querySelectorAll('.scroll-reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
});
