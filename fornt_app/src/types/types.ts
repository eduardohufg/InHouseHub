export interface Authresponse {
    body: {
        user: User;
        accessToken: string;
        refreshToken: string;

};
}

export interface AuthresponseError {
    body: {
        error: string;
    };
}

export interface User {
    _id: number;
    name: string;
    lastname: string;
    username: string;
}   

export interface AccessTokenResponse {
    statusCode: number;
    body: {
        accessToken: string;
    },
    error?: string;
}