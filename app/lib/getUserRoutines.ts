import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function getUserRoutines(currentUserId: number) {
    try {
        const routines = await prisma.routine.findMany({
            where: {
                userId: currentUserId,
            },
            include: {
                routineExercises: {
                    orderBy: { order: 'asc' },
                    include: {
                        sets: true,
                    }
                }
            }
        })
        return routines;
    } catch(error) {
        console.log(error);
    }
}