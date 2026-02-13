import api from "./api";
import TokenService from "./token.service";

const AuthService = {
    login: async (username, password) => {
        const response = await api.post("/api/users/login/", {
            username,
            password,
        });
        if (response.data.access) {
            TokenService.updateLocalAccessToken(response.data.access);
            TokenService.updateLocalRefreshToken(response.data.refresh);
        }
        return response.data;
    },

    logout: () => {
        TokenService.removeUser();
    },

    getCurrentUser: () => {
        return TokenService.getLocalAccessToken();
    },

    verifyRefreshToken: async () => {
        const refresh = TokenService.getLocalRefreshToken();
        if (!refresh) return null;

        try {
            const response = await api.post("/api/users/login/refresh/", { refresh });
            if (response.data.access) {
                TokenService.updateLocalAccessToken(response.data.access);
                return response.data.access;
            }
        } catch (e) {
            TokenService.removeUser();
        }
        return null;
    }
};

export default AuthService;
