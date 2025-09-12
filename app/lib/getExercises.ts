import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function getExercises() {
    try {
        const data = await prisma.muscleGroup.findMany({
            include: {exercises: true},
        })
        return data;
    } catch(error) {
        return error;
    }
}