let accessToken = null;

const TokenService = {
    getLocalRefreshToken: () => {
        return localStorage.getItem("refreshToken");
    },

    getLocalAccessToken: () => {
        return accessToken;
    },

    updateLocalRefreshToken: (token) => {
        localStorage.setItem("refreshToken", token);
    },

    updateLocalAccessToken: (token) => {
        accessToken = token;
    },

    removeUser: () => {
        localStorage.removeItem("refreshToken");
        accessToken = null;
    },
};

export default TokenService;
