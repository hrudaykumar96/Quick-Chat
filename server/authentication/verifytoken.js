const jwt = require('jsonwebtoken');
const Users = require('../models/Users');


const verify_token=async(req, res, next)=>{
    try {
        const token = req.headers.authorization;
        if(!token || !token.startsWith('Bearer ')){
            res.json({error: 'unauthorised user'})
        }
        const decoded = token.split(' ')[1];
        const decoded_data = await jwt.verify(decoded, process.env.SECRET_KEY );
        const userID = decoded_data.id
        if(!userID){
            return res.status(404).json({ error: 'User not found' });
        }
        const user = await Users.findById(userID);
        req.user = user;
        next();
    } catch (error) {

        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = verify_token;