import { decodeToken } from "../utils/crypto-helper.js";
import { HttpStatus } from "../utils/http-status.js";
import { Users } from "../models/user.model.js";

export class AuthMiddleware extends HttpStatus {
    validateToken = async (
        req,
        res,
        next
    ) => {
        try {
            const token = req.header("access-token");
            if (!token) {
                return this.sendInvalidTokenResponse(res, "Invalid token.");
            }

            const decodeData = decodeToken(token);
            if (!decodeData) {
                return this.sendInvalidTokenResponse(res, "Invalid token.");
            }

            const user = await Users.findOne({
                where: {
                    id: decodeData.id,
                }
            });

            if (!user) {
                return this.sendInvalidTokenResponse(res, "Invalid token.");
            }

            res.locals.auth = {
                success: true,
                message: "Valid token.",
                data: user,
                tokenData: decodeData,
                userId: user.id,
            };

            next();
        } catch (err) {
            console.log("err: ", err);
            this.sendInvalidTokenResponse(res, "Invalid token.");
        }
    };
}
