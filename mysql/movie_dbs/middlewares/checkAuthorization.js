
import { client } from "../db.js";

const checkAuthorization = async (req, res, next) => {
    if (!req.headers["authorization"]) {
        return res.status(400).json({
            success: false,
            Status:400,
            message: "User needs to login to perform this action",
        });
    }
    
    const fnd = await client.query('select * from tokens where token=$1',[req.headers["authorization"]]);
    if (!fnd.rows) {
        return res.status(404).send("Login to perform this action");
    }
    console.log(fnd.rows[0].token===req.headers["authorization"])
    const role = fnd.rows[0].role;
    next(role);
};

export { checkAuthorization };
