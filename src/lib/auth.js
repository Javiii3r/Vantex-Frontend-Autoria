export function isAuthenticated() {
    if (typeof window === "undefined") return false;

    const token = localStorage.getItem("token");
    if (token !== null && token !== "") {
        return true;
    } else {
        return false;
    }
}

export function getUser() {
    if (typeof window === "undefined") return null;
    
    const userString = localStorage.getItem("user");
    if (userString !== null) {
        return JSON.parse(userString);
    } else {
        return null;
    }
}

export function setAuthData(user, token) {
    if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);
    }
}

export function clearAuthData() {
    if (typeof window !== "undefined") {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
    }
}

export function getUserRole() {
    const user = getUser();
    if (user !== null) {
        return user.role;
    } else {
        return null;
    }
}

export function redirectIfNotAuthenticated(targetUrl = "/login") {
    if (typeof window === "undefined") return;

    if (isAuthenticated() === false) {
        window.location.href = targetUrl;
    }
}

export function redirectIfAuthenticated(targetUrl = "/dashboard") {
    if (typeof window === "undefined") return;

    if (isAuthenticated() === true) {
        window.location.href = targetUrl;
    }
}

export const ROLE_LABELS = {
    admin: 'Administrador',
    maintenance_manager: 'Jefe de Mantenimiento',
    technician: 'Técnico',
};