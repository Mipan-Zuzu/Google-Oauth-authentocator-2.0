   export interface myCookie {
        token: string
    }

    export interface tokenAuth {
        token: string,
        iat: number,
        exp: number
    }

    export interface UIuserSchema {
        googleId: string
        refreshToken: string
        email? : string
        name? : string
        avatar? : string
        role : string
    }