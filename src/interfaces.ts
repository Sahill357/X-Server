

export interface JWTUser {
    id: string;
    email: string;
}

export interface GraphqlContext {
 prisma: any;
 user?: JWTUser;
     
}
