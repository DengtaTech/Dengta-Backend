module.exports = {
    noToken: (res)=>{
        res.status(401).json({ error: 'Client error - No token provided' });
    },
    wrongToken: (res) => {
        res.status(403).json({ error: 'Client error - Invalid token' });
    },

}