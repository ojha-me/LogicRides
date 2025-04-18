// our goal with this middle ware is to intercept each requests
// verify the token in the request using our secret key
// if the token is verified the extract user from id/email
// Attach the user info to the request like req.user

const jwt =  require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // usually the token is sent in either Authorization header: bearer or sometimes in x-auth-token
    // check for both
    const authHeader  = req.header('Authorization');
    const token = authHeader && authHeader.startsWith('Bearer') ? authHeader.split(" ")[1]: req.header('x-auth-token');

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try{
        // jwt.verify(token, secret) verifies the token's signature and expiration
        const decoded =  jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    }
    catch (error) {
        console.error("Token verification failed", error.message)
        return res.status(401).send("Token is not valid")
    }
}

module.exports = authMiddleware;