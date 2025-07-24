const API_BASE = "http://localhost:8000";

document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners

    document.getElementById('event-form').onsubmit = async (e) => {
        e.preventDefault();
        const user_id = document.getElementById('user_id').value;
        const event_type = document.getElementById('event_type').value;
        const timestamp = document.getElementById('timestamp').value;
        const isoTimestamp = new Date(timestamp).toISOString();

        const res = await fetch(`${API_BASE}/events`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({user_id, event_type, timestamp: isoTimestamp})
        });
        const data = await res.json();
        document.getElementById('event-result').innerText = res.ok ? "Event created!" : JSON.stringify(data);

        await loadEvents();   // Always reload events list
        await loadSummary();  // Always reload summary
    };

    document.getElementById('summary-form').onsubmit = async (e) => {
        e.preventDefault();
        await loadSummary(true); // pass true = use filters
    };

    document.getElementById('refresh-events').onclick = loadEvents;
    document.getElementById('refresh-summary').onclick = () => loadSummary(true);

    // Load all data by default
    loadEvents();
    loadSummary();
});

// List all events
async function loadEvents() {
    const res = await fetch(`${API_BASE}/events`);
    const data = await res.json();
    const list = document.getElementById('events');
    list.innerHTML = '';
    if (data.events && data.events.length) {
        data.events.forEach(ev => {
            const li = document.createElement('li');
            li.textContent = `${ev.timestamp} – user: ${ev.user_id}, type: ${ev.event_type}`;
            list.appendChild(li);
        });
    } else {
        list.innerHTML = '<li style="color:#9a9a9a;">No events found.</li>';
    }
}

// Show summary, optionally filtered
async function loadSummary(useFilters = false) {
    let url = `${API_BASE}/summary`;
    if (useFilters) {
        const user_id = document.getElementById('summary-user_id').value;
        const event_type = document.getElementById('summary-event_type').value;
        const params = [];
        if (user_id) params.push(`user_id=${encodeURIComponent(user_id)}`);
        if (event_type) params.push(`event_type=${encodeURIComponent(event_type)}`);
        if (params.length) url += `?${params.join('&')}`;
    }
    const res = await fetch(url);
    const data = await res.json();
    document.getElementById('summary-result').innerText =
        typeof data.total_events !== 'undefined'
            ? `Total Events: ${data.total_events}`
            : 'No summary found.';
}
