import axios from "axios";
import { json } from "body-parser";
import { prismaClient } from "../../client/db";
import JWTService from "../../services/jwt";
import { GraphqlContext } from "../../interfaces";
import { User } from "@prisma/client";
import UserService from "../../services/user";
import { redisClient } from "../../client/redis";

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    const resultToken = await UserService.verifyGoogleAuthToken(token);
    return resultToken;
  },

  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    console.log("getCurrentUser called with context:", ctx); // Highlighted: Added logging
    const id = ctx.user?.id;
    if (!id) {
      console.error("No user ID found in context"); // Highlighted: Added logging
      return null;
    }

    try {
      const user = await UserService.getUserById(id);
      console.log("Found user:", user); // Highlighted: Added logging
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error); // Highlighted: Added logging
      return null;
    }
  },

  getUserById: async (parent: any, { id }: { id: string }, ctx: GraphqlContext) => {
    try {
      const user = await UserService.getUserById(id);
      console.log("Found user by ID:", user); // Highlighted: Added logging
      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error); // Highlighted: Added logging
      return null;
    }
  }
};

const extraResolvers = {
  User: {
    tweets: (parent: User) =>
      prismaClient.tweet.findMany({ where: { author: { id: parent.id } } }),

    followers: async (parent: User) => {
      try {
        const result = await prismaClient.follows.findMany({
          where: { following: { id: parent.id } },
          include: {
            followers: true,
          },
        });
        console.log("Found sfollowerss:", result); // Highlighted: Added logging
        return result.map((el) => el.followers);
      } catch (error) {
        console.error("Error getting followers:", error); // Highlighted: Added logging
        return [];
      }
    },

    following: async (parent: User) => {
      try {
        const result = await prismaClient.follows.findMany({
          where: { followers: { id: parent.id } },
          include: {
            following: true,
          },
        });
        console.log("Found following:", result); // Highlighted: Added logging
        return result.map((el) => el.following);
      } catch (error) {
        console.error("Error getting following:", error); // Highlighted: Added logging
        return [];
      }
    },

    recommendedUsers: async (parent: User, _: any, ctx: GraphqlContext) => {
      if (!ctx.user) return [];
      const cachedValue = await redisClient.get(`RECOMMENDED_USERS:${ctx.user.id}`);
      if (cachedValue) {
        console.log("Cached Found");
        return JSON.parse(cachedValue); // Highlighted: Changed to JSON.parse
      }

      try {
        const myfollowings = await prismaClient.follows.findMany({
          where: { followers: { id: ctx.user?.id } },
          include: {
            following: {
              include: { followers: { include: { following: true } } },
            },
          },
        });

        const users: User[] = [];
        for (const followings of myfollowings) {
          for (const followingOfFollowedUser of followings.following.followers) {
            if (
              followingOfFollowedUser.following.id !== ctx.user.id &&
              myfollowings.findIndex((e) => e?.followerId === followingOfFollowedUser.following.id) < 0
            ) {
              users.push(followingOfFollowedUser.following);
            }
          }
        }

        console.log("Cached Not Found");
        await redisClient.set(
          `RECOMMENDED_USERS:${ctx.user.id}`,
          JSON.stringify(users)
        );

        return users;
      } catch (error) {
        console.error("Error getting recommended users:", error); // Highlighted: Added logging
        return [];
      }
    },
  },
};

const mutations = {
  followUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
    try {
      await UserService.followUser(ctx.user.id, to);
      await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`)
      return true;
    } catch (error) {
      console.error("Error following user:", error); // Highlighted: Added logging
      return false;
    }
  },

  unfollowUser: async (parent: any, { to }: { to: string }, ctx: GraphqlContext) => {
    if (!ctx.user || !ctx.user.id) throw new Error("Unauthenticated");
    try {
      await UserService.unfollowUser(ctx.user.id, to);
      await redisClient.del(`RECOMMENDED_USERS:${ctx.user.id}`)
      return true;
    } catch (error) {
      console.error("Error unfollowing user:", error); // Highlighted: Added logging
      return false;
    }
  },
};

export const resolvers = { queries, extraResolvers, mutations };
