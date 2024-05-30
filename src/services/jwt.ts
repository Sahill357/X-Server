import JWT from "jsonwebtoken"
import { PrismaClient } from "@prisma/client";
import { User } from "@prisma/client";

const JWT_SECRET = "#$@hil$@m";

class JWTService {
    public static   generateTokenForUser(user: User){
        const payload ={
            id:user?.id,
            email:user?.email,

        };
        const token= JWT.sign(payload,JWT_SECRET);
        return token;

    }
}

export default JWTService;