import { PrismaClient } from "../generated/prisma";
import { CreateUserResult } from "./definitions";

const prisma = new PrismaClient();

export async function createUser(
    username: string,
    email: string,
    password: string
): Promise<CreateUserResult> {
    try {
        const userByUsername = await prisma.user.findUnique({
            where: { username }
        });
        if (userByUsername) {
            return { success: false, error: "Username is already used." };
        }

        const userByEmail = await prisma.user.findUnique({
            where: { email }
        });
        if (userByEmail) {
            return { success: false, error: "Email is already used." };
        }

        const user = await prisma.user.create({
            data: {
                username: username,
                email: email,
                password: password,
                role: "user"
            }
        })

        return { success: true, user };
    } catch(error) {
        const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
        return { success: false, error: errorMessage };
    }
}