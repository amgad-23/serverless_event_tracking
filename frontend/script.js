const API_BASE = "http://localhost:8000";
let allEvents = [];

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

        await loadEvents(); // Always reload events list
        await loadSummary(); // Always reload summary
    };

    document.getElementById('summary-form').onsubmit = async (e) => {
        e.preventDefault();
        await loadSummary(true); // pass true = use filters
    };

    // Enhanced event listeners
    const eventBtn = document.getElementById('refresh-events');
    if (eventBtn) eventBtn.onclick = loadEvents;

    const sumBtn = document.getElementById('refresh-summary');
    if (sumBtn) sumBtn.onclick = () => loadSummary(true);

    // Filter functionality
    const filterUser = document.getElementById('filter-user');
    const filterType = document.getElementById('filter-type');
    const clearFilters = document.getElementById('clear-filters');

    filterUser.oninput = filterEvents;
    filterType.oninput = filterEvents;
    clearFilters.onclick = () => {
        filterUser.value = '';
        filterType.value = '';
        filterEvents();
    };

    loadEvents();
    loadSummary();
});

// Enhanced events loading with better UI
async function loadEvents() {
    try {
        const res = await fetch(`${API_BASE}/events`);
        console.log(`Response status: ${res.status}`);
        const data = await res.json();
        console.log('Events data:', data);

        allEvents = data.events || [];
        displayEvents(allEvents);
        updateEventsCount(allEvents.length);

    } catch (error) {
        console.error('Error loading events:', error);
        const container = document.getElementById('events-container');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">⚠️</div>
                <p>Error loading events. Please try again.</p>
            </div>
        `;
    }
}

function displayEvents(events) {
    const container = document.getElementById('events-container');

    if (!events || events.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <p>No events found.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = events.map(event => {
        const date = new Date(event.timestamp);
        const formattedDate = date.toLocaleDateString();
        const formattedTime = date.toLocaleTimeString();

        return `
            <div class="event-item">
                <div class="event-details">
                    <div class="event-type">${escapeHtml(event.event_type)}</div>
                    <div class="event-user">👤 User: ${escapeHtml(event.user_id)}</div>
                    <div class="event-timestamp">🕒 ${formattedDate} at ${formattedTime}</div>
                </div>
                <div class="event-badge">${escapeHtml(event.event_type)}</div>
            </div>
        `;
    }).join('');
}

function filterEvents() {
    const userFilter = document.getElementById('filter-user').value.toLowerCase();
    const typeFilter = document.getElementById('filter-type').value.toLowerCase();

    const filteredEvents = allEvents.filter(event => {
        const matchesUser = !userFilter || event.user_id.toLowerCase().includes(userFilter);
        const matchesType = !typeFilter || event.event_type.toLowerCase().includes(typeFilter);
        return matchesUser && matchesType;
    });

    displayEvents(filteredEvents);
    updateEventsCount(filteredEvents.length, allEvents.length);
}

function updateEventsCount(displayed, total = null) {
    const countEl = document.getElementById('events-count');
    if (total !== null && displayed !== total) {
        countEl.textContent = `Showing ${displayed} of ${total} events`;
    } else {
        countEl.textContent = `${displayed} event${displayed !== 1 ? 's' : ''}`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show summary, optionally filtered
async function loadSummary(useFilters = false) {
    let url = `${API_BASE}/summary`;
    console.log(`Loading summary from: ${url}`);

    if (useFilters) {
        const user_id = document.getElementById('summary-user_id').value;
        const event_type = document.getElementById('summary-event_type').value;
        const params = [];

        if (user_id) params.push(`user_id=${encodeURIComponent(user_id)}`);
        if (event_type) params.push(`event_type=${encodeURIComponent(event_type)}`);
        if (params.length) url += `?${params.join('&')}`;
    }

    const res = await fetch(url);
    console.log(`Response status: ${res.status}`);
    const data = await res.json();
    console.log('Summary data:', data);

    document.getElementById('summary-result').innerText =
        typeof data.total_events !== 'undefined' ?
        `Total Events: ${data.total_events}` :
        'No summary found.';
}