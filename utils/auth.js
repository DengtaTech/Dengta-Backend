const jwt = require('jsonwebtoken');
const errorMsg = require('./errorMsg');
require('dotenv').config();

module.exports = {
    generateAccessToken: async (userId) => {
        const secretKey = process.env.SECRET;
        const payload = { id: userId };
        const token = jwt.sign(payload, secretKey, { expiresIn: '24h' });
        const tokenInfo = {
            token: token,
            expire: `${60 * 60 * 24}`
        };
        return tokenInfo;
    },
    // Middleware for verifying JWT token
    verifyToken: async (req, res, next) => {
        const token = req.headers.authorization;
        console.log(token);
        try {
            if (!token) {
                return errorMsg.noToken(res);
            }
            const pureToken = token.split(' ')[1];
            const decodedToken = jwt.verify(pureToken, process.env.SECRET);
            req.decodedToken = decodedToken;
            next();
        } catch (error) {
            console.error(error);
            return errorMsg.wrongToken(res);
        }
    },
    /** 當標示authorize為async會提示Route.get() requires a callback function but got a [object Promise]
     * 認為可能原因：
     * 因為標示為async的函示被呼叫時必回傳一個Promise所以儘管內容是回傳一個中間件函式，express也認為這是一個Promise物件
     * 所以去掉async後不再被視為Promise就能正確執行內部程式
    */
    authorize: (requiredRole) => {
        return async(req, res, next) => {
            try {
                const loginUserId = req.decodedToken.id;
                const roles = await roleService.checkRole(res, loginUserId);
                if (roles.length === 0) return errorMsg.roleProblem(res);
                const flag = roles.some((role) => role.name == requiredRole);
                if (flag) {
                    next();
                } else {
                    errorMsg.permissionDenied(res);
                }
            } catch (error) {
                console.error(error);
            }

        };
    }
}