// src/lib/api.js
import { clearAuthData } from './auth.js';

const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api";

class ApiClient {
    
    async request(endpoint, method = "GET", bodyData = null) {
        const url = API_URL + endpoint;
        const headers = { "Content-Type": "application/json" };

        if (typeof window !== 'undefined') {
            const token = localStorage.getItem("token");
            if (token !== null) {
                headers["Authorization"] = "Bearer " + token;
            }
        }

        const config = {
            method: method,
            headers: headers
        };

        if (bodyData !== null) {
            config.body = JSON.stringify(bodyData);
        }

        const response = await fetch(url, config);
        
        let data = null;
        if (response.status !== 204) {
            data = await response.json();
        }

        if (response.ok === false) {
            if (response.status === 401 && typeof window !== "undefined") {
                clearAuthData();
                window.location.href = "/login";
            }
            let errorMsg = "Error en la petición";
            if (data !== null && data.message) errorMsg = data.message;
            if (data !== null && data.error) errorMsg = data.error;
            
            throw new Error(errorMsg);
        }

        return data;
    }

    login = async (email, password) => {
        return await this.request("/auth/login", "POST", { email: email, password: password });
    }

    register = async (userData) => {
        return await this.request("/auth/register", "POST", userData);
    }

    updateProfile = async (data) => {
        return await this.request("/auth/users/update/profile", "PUT", data);
    }

    getUsers = async () => {
        return await this.request("/auth/users", "GET");
    }

    machines = {
        getAll: async () => await this.request("/machines", "GET"),
        create: async (data) => await this.request("/machines", "POST", data),
        update: async (id, data) => await this.request("/machines/" + id, "PUT", data),
        delete: async (id) => await this.request("/machines/" + id, "DELETE")
    }



}