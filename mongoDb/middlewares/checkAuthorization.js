import Token from "../Models/Token.js";

const checkAuthorization = async (req, res, next) => {
    if (!req.headers["authorization"]) {
        return res.status(400).json({
            success: false,
            message: "User needs to login to perform this action",
        });
    }
    
    const fnd = await Token.findOne({ Token: req.headers["authorization"].split(" ")[1] });
    if (!fnd) {
        return res.status(404).send("Login to perform this action");
    }
    next();
};

export { checkAuthorization };
