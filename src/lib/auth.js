export function isAuthenticated() {
    if (typeof window === "undefined") return false;
    const token = localStorage.getItem("token");
    return token !== null && token !== "";
}

export function getUser() {
    if (typeof window === "undefined") return null;
    const userString = localStorage.getItem("user");
    return userString !== null ? JSON.parse(userString) : null;
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
    return user !== null ? user.role : null;
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
    admin: 'Administrator',
    maintenance_manager: 'Maintenance Manager',
    technician: 'Technician',
};