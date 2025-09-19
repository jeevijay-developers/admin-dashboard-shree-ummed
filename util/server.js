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

export const fetchFacilities = async (page = 1, limit = 9) => {
    try {
        const response = await axiosInstance.get(`/api/facilities/get-all?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching facilities:", error);
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

export const fetchEvents = async (page = 1, limit = 9) => {
    try {
        const response = await axiosInstance.get(`/api/events?page=${page}&limit=${limit}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching events:", error);
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

export const deleteFacility = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/facilities/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting facility:", error);
        throw error;
    }
}

export const deleteEvent = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/events/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting event:", error);
        throw error;
    }
}

export const deleteEventGallery = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/event-gallery/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting event gallery:", error);
        throw error;
    }
}

export const deleteClubGallery = async (id) => {
    try {
        const response = await axiosInstance.delete(`/api/club-gallery/delete/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting club gallery:", error);
        throw error;
    }
}

// Check database connectivity
export const checkDatabaseConnection = async () => {
    try {
        const response = await axiosInstance.get("/api/health/db");
        return response.data;
    } catch (error) {
        console.error("Error checking database connection:", error);
        throw error;
    }
}