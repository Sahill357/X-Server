// import express, { query } from "express";
// import { ApolloServer } from "@apollo/server";
// import { expressMiddleware } from "@apollo/server/express4";
// import bodyParser from "body-parser";
// import { prismaClient } from "../client/db";
// import { User } from "./user";
// import cors from "cors";
// import JWTService from "../services/jwt";
// import { Tweet } from "./tweet";

// interface MyContext {
//   user: any;
//   prisma: typeof prismaClient;
// }

// export async function initServer() {
//   const app = express();

//   app.use(bodyParser.json());
//   app.use(cors());
//   const graphqlServer = new ApolloServer<MyContext>({
//     typeDefs: `
//         ${User.types}
//         ${Tweet.types}

//         type Query {
//             ${User.queries}  
//             ${Tweet.queries}      
                 
//           }
          
//           type Mutation {
//             ${Tweet.muatations}
//             ${User.mutations}
//           }
//     `,
//     resolvers: {
//       Query: {
//         ...User.resolvers.queries,
//         ...Tweet.resolvers.queries,
//       },
//       Mutation:{
//         ...Tweet.resolvers.mutations,
//         ...User.resolvers.mutations,
//       },
//       ...Tweet.resolvers.extraResolvers,
//       ...User.resolvers.extraResolvers,
//     },
//   });

//   await graphqlServer.start();

//   app.use(
//     "/graphql",
//     expressMiddleware(graphqlServer, {
//       context: async ({ req, res }) => {
//         return {
//           user: req.headers.authorization
//             ? JWTService.decodeToken(
//                 req.headers.authorization.split("Bearer ")[1]
//               )
//             : undefined,
//           prisma: prismaClient,
//         };
//       },
//     })
//   );

//   return app;
// }


import express, { query } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import bodyParser from "body-parser";
import { prismaClient } from "../client/db";
import { User } from "./user";
import cors from "cors";
import JWTService from "../services/jwt";
import { Tweet } from "./tweet";

interface MyContext {
  user: any;
  prisma: typeof prismaClient;
}

export async function initServer() {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  // Define a root route to confirm server is running
  app.get("/", (req, res) => {
    res.send("Server is running");
  });

  const graphqlServer = new ApolloServer<MyContext>({
    typeDefs: `
        ${User.types}
        ${Tweet.types}

        type Query {
            ${User.queries}  
            ${Tweet.queries}      
        }
          
          Mutation {
            ...Tweet.resolvers.mutations,
//         ...User.resolvers.mutations,
        }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
        ...Tweet.resolvers.queries,
      },
      Mutation: {
        ...Tweet.resolvers.mutations,
        ...User.resolvers.mutations,
      },
      ...Tweet.resolvers.extraResolvers,
      ...User.resolvers.extraResolvers,
    },
  });

  await graphqlServer.start();

  app.use(
    "/graphql",
    expressMiddleware(graphqlServer, {
      context: async ({ req, res }) => {
        return {
          user: req.headers.authorization
            ? JWTService.decodeToken(
                req.headers.authorization.split("Bearer ")[1]
              )
            : undefined,
          prisma: prismaClient,
        };
      },
    })
  );

  return app;
}
