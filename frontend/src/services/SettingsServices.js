import api from './api';

const TEAM_API = '/api/settings';

export const getTeamMembers = async () => {
    const response = await api.get(TEAM_API);
    return response.data;
};

export const createTeamMember = async (memberData) => {
    const response = await api.post(TEAM_API, memberData);
    return response.data;
};

export const updateTeamMember = async (id, memberData) => {
    const response = await api.put(`${TEAM_API}/${id}`, memberData);
    return response.data;
};

export const deleteTeamMember = async (id) => {
    const response = await api.delete(`${TEAM_API}/${id}`);
    return response.data;
};

export const addPaymentToMember = async (id, paymentData) => {
    const response = await api.post(`${TEAM_API}/${id}/payment`, paymentData);
    return response.data;
};

export const addAdvanceToMember = async (id, advanceData) => {
    const response = await api.post(`${TEAM_API}/${id}/advance`, advanceData);
    return response.data;
};

export const addWithdrawalToMember = async (id, withdrawalData) => {
    const response = await api.post(`${TEAM_API}/${id}/withdrawal`, withdrawalData);
    return response.data;
};
