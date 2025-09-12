import { PrismaClient } from "../generated/prisma";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import z from 'zod';
import { AuthUser, User } from "./definitions";
import { CredentialsSignin } from "next-auth";
import type { NextAuthConfig } from "next-auth";

const prisma = new PrismaClient();

async function getUser(username: string): Promise<AuthUser | null> {
    try {
        const user = await prisma.user.findUnique({
            where:{username}
        })
        return user;
    } catch(error) {
        throw new Error("Something went wrong");
    }
}

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: {label: "Username", type:"text"},
                password: {label: "Password", type:"password"}
            },
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({username: z.string(), password: z.string().min(4)})
                    .safeParse(credentials)
                if(parsedCredentials.error) {
                    const errorMessage = parsedCredentials.error.errors.map(err => err.message).join(", ");
                    throw new Error(`Invalid Credentials: ${errorMessage}`);
                }
                if(parsedCredentials.success) {
                    const {username, password} = parsedCredentials.data;
                    const user  = await getUser(username);
                    if(!user) {
                        throw new CredentialsSignin();
                    };
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    if(!passwordsMatch) {
                        throw new Error("Invalid Credentials");
                    }
                    
                    return {
                        id: user.id.toString(),
                        username: user.username,
                        email: user.email,
                        role: user.role
                    }
                } else { 
                    return null;
                }
            }
        })
    ],
    session: { strategy: "jwt", },
    callbacks:{
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.username;
                token.email = user.email;
            }
            return token
        },
        async session({ session, token }) {
            session.user.id = token.id;
            session.user.name = token.name;
            session.user.role = token.role;
                
            return session
        },
        async redirect({ baseUrl }) {
            return baseUrl;
        },
  }
} satisfies NextAuthConfig;

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut
} = NextAuth(authOptions);