const BASE = 'http://localhost:8001/api/v1';

function getToken() {
    return localStorage.getItem('lbs_access_token') || '';
}

async function request(method, path, body = null, auth = true) {
    const headers = { 'Content-Type': 'application/json' };
    if (auth) headers['Authorization'] = `Bearer ${getToken()}`;

    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);

    const res = await fetch(`${BASE}${path}`, opts);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const err = new Error(data.message || 'Request failed');
        err.statusCode = res.status;
        throw err;
    }
    return data;
}

export const api = {
    get: (path, auth = true) => request('GET', path, null, auth),
    post: (path, body, auth = true) => request('POST', path, body, auth),
    patch: (path, body, auth = true) => request('PATCH', path, body, auth),
    delete: (path, auth = true) => request('DELETE', path, null, auth),
};
