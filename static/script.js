const apiBase = '';
async function fetchEvents() {
    try {
        const res = await fetch(apiBase + '/events');
        const data = await res.json();
        const tbody = document.querySelector('#events-table tbody');
        if (res.ok && data.events) {
            if (data.events.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3">No events found</td></tr>';
            } else {
                tbody.innerHTML = data.events.map(e => `<tr><td>${e.user_id}</td><td>${e.event_type}</td><td>${e.timestamp}</td></tr>`).join('');
            }
        } else {
            tbody.innerHTML = `<tr><td colspan="3">${data.error || 'Error fetching events'}</td></tr>`;
        }
    } catch (err) {
        document.querySelector('#events-table tbody').innerHTML = '<tr><td colspan="3">Network error</td></tr>';
    }
}
document.getElementById('event-form').onsubmit = async function(e) {
    e.preventDefault();
    const user_id = document.getElementById('user_id').value;
    const event_type = document.getElementById('event_type').value;
    const timestamp = new Date(document.getElementById('timestamp').value).toISOString();
    const msg = document.getElementById('form-msg');
    msg.textContent = '';
    msg.className = '';
    try {
        const res = await fetch(apiBase + '/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id, event_type, timestamp })
        });
        const data = await res.json();
        if (res.ok) {
            msg.textContent = data.message;
            msg.className = 'success';
        } else {
            msg.textContent = data.error || 'Error submitting event';
            msg.className = 'error';
        }
    } catch (err) {
        msg.textContent = 'Network error';
        msg.className = 'error';
    }
};
document.getElementById('refresh-summary').onclick = async function() {
    const user_id = document.getElementById('filter_user_id').value;
    const event_type = document.getElementById('filter_event_type').value;
    let url = apiBase + '/summary';
    const params = [];
    if (user_id) params.push('user_id=' + encodeURIComponent(user_id));
    if (event_type) params.push('event_type=' + encodeURIComponent(event_type));
    if (params.length) url += '?' + params.join('&');
    try {
        const res = await fetch(url);
        const data = await res.json();
        document.getElementById('summary-result').innerText = 'Total Events: ' + (data.total_events ?? data.error);
    } catch (err) {
        document.getElementById('summary-result').innerText = 'Network error';
    }
};
document.getElementById('refresh-events').onclick = fetchEvents;
fetchEvents(); 