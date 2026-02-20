import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '';

// ── Verify the master key via the backend ────────────────
// Returns { success, accessToken, message } on success
// Throws on failure (401 / 500)
export const verifyMasterKey = async (key) => {
    const { data } = await axios.post(`${API_BASE}/api/config/verify-master-key`, { key });
    return data;
};

export default { verifyMasterKey };
