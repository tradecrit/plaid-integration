import {JwtPayload} from "jsonwebtoken";

export interface ApiResponse {
    token: JwtPayload,
    authenticated: boolean
}