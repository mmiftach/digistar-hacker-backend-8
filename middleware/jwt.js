const jwt = require('jsonwebtoken');

async function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).json({ message: 'A token is required for authentication' });
    }

    jwt.verify(token, 'secret',(err,decoded)=>{
        if(err){
            if(err.name === 'TokenExpiredError'){
                return res.status(401).json({ message: 'Token expired' });
            }
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

module.exports = {
    verifyToken,
};
