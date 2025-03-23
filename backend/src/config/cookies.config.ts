import { CookieOptions } from "express";

export const refreshTokenCookieConfig: CookieOptions = {
    httpOnly: true,
    maxAge: 3 * 24 * 60 * 60 * 1000
}