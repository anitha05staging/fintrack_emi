import axios from "axios";
import TokenService from "./token.service";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = TokenService.getLocalAccessToken();
        if (token) {
            config.headers["Authorization"] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (res) => {
        return res;
    },
    async (err) => {
        const originalConfig = err.config;

        if (originalConfig.url !== "/api/users/login/" && err.response) {
            // Access Token was expired
            if (err.response.status === 401 && !originalConfig._retry) {
                originalConfig._retry = true;

                try {
                    const rs = await axios.post(
                        (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000") + "/api/users/login/refresh/",
                        {
                            refresh: TokenService.getLocalRefreshToken(),
                        }
                    );

                    const { access } = rs.data;
                    TokenService.updateLocalAccessToken(access);

                    return api(originalConfig);
                } catch (_error) {
                    // Refresh token failed
                    TokenService.removeUser();
                    window.location.href = "/login";
                    return Promise.reject(_error);
                }
            }
        }

        return Promise.reject(err);
    }
);

export default api;
