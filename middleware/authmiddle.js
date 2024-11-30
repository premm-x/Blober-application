const { validateToken } = require("../service/auth");

function validateAuthenticationCookies(cookieName){
    return (req, res, next) => {
        const TokencookieValue = req.cookies[cookieName];

        if(!TokencookieValue) return next();

        try {
            const userPayload = validateToken(TokencookieValue);
            req.user = userPayload;
        } catch (error) {}

        next();
    }
}

module.exports = {
    validateAuthenticationCookies,
}