import jsonwebtoken from "jsonwebtoken";
const authenticate = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            res.status(401).json({ msg: "Access denied. Please login again." });
            return;
        }
        const tokenData = jsonwebtoken.verify(token, process.env.JSON_WEB_TOKEN_SECRET);
        if (!tokenData) {
            res.status(401).json({ msg: "Access denied. Please login again." });
            return;
        }
        req.user = tokenData;
        next();
    }
    catch (error) {
        res.status(401).json({ msg: "Internal server error" });
    }
};
export default authenticate;
