import jwt from 'jsonwebtoken'

export const secret = {
    TOKEN_SECRET_JWT: process.env.TOKEN_SECRET_JWT || 'jWt9982_s!tokenSecreTqQrtw'
}

export const generateTokens = (req, user) => {
    const ACCESS_TOKEN = jwt.sign({
        data: user,
        type: 'ACCESS_TOKEN'
    },
        secret.TOKEN_SECRET_JWT, {
        expiresIn: 1200
    });
    return {
        accessToken: ACCESS_TOKEN,
    }
}


