import axios from "axios";
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchUpdate = async (endpoint, setData) => {
    try {
        const res = await axios.get(`${baseUrl}/${endpoint}`);
        setData(res.data);
    } catch (err) {
        console.error(`Failed to fetch ${endpoint}`);
    }
};

export const postUpdate = async (endpoint, payload, setData, refreshEndpoint) => {
    try {
        await axios.post(`${baseUrl}/${endpoint}`, payload);
        if (refreshEndpoint && setData) {
            await fetchUpdate(refreshEndpoint, setData);
        }

    } catch (error) {
        console.error(`Failed to post to ${endpoint}`);
    }
}

export const patchUpdate = async (endpoint, payload, setData, refreshEndpoint) => {
    try {
        await axios.patch(`${baseUrl}/${endpoint}`, payload)
        if (refreshEndpoint && setData) {
            await fetchUpdate(refreshEndpoint, setData);
        }
    } catch (error) {
        console.error(`Failed to patch ${endpoint}`);
    }
}

export const deleteupdate = async (endpoint, setData, refreshEndpoint) => {
    try {
        await axios.delete(`${baseUrl}/${endpoint}`)
        if (refreshEndpoint && setData) {
            await fetchUpdate(refreshEndpoint, setData);
        }
    } catch (error) {
        console.error(`Failed to delete ${endpoint}`);
    }
}