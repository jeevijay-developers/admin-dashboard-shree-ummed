import axiosInstance from "./axiosInstance";

export const addFacility = async (formData) => {
    try {
        const response = await axiosInstance.post("/api/facilities", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding facility:", error);
        throw error;
    }
}

export const fetchFacilities = async (page = 1, limit = 9) => {
    try {
        const response = await axiosInstance.get(`/api/facilities?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching facilities:", error);
        throw error;
    }
}

export const fetchEvents = async (page = 1, limit = 9) => {
    try {
        const response = await axiosInstance.get(`/api/events?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
}

export const addEvent = async (formData) => {
    try {
        const response = await axiosInstance.post("/api/events", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding event:", error);
        throw error;
    }
}

export const fetchEventByDate = async (date) => {
    try {
        const response = await axiosInstance.get(`/api/events/date/${date}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching events by date:", error);
        throw error;
    }
}

export const eventGallery = async (formData) => {
    try {
        const response = await axiosInstance.post("/api/event-gallery", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding event gallery:", error);
        throw error;
    }
}

export const fetchEventGalleries = async (page = 1, limit = 9) => {
    try {
        const response = await axiosInstance.get(`/api/event-gallery?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching event galleries:", error);
        throw error;
    }
}

export const clubGallery = async (formData) => {
    try {
        const response = await axiosInstance.post("/api/club-gallery", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error adding club gallery:", error);
        throw error;
    }
}

export const fetchClubGalleries = async (page = 1, limit = 9) => {
    try {
        const response = await axiosInstance.get(`/api/club-gallery?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching club galleries:", error);
        throw error;
    }
}

export const fetchClubGalleryBySlug = async (slug) => {
    try {
        const response = await axiosInstance.get(`/api/club-gallery/${slug}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching club gallery by slug:", error);
        throw error;
    }
}
