import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function getRoutineById(routineId: number, userId: number) {
    try {
        const routineById = await prisma.routine.findUnique({
            where: {
                id: routineId,
                userId: userId,
            },
            include: {
                routineExercises: {
                    include: {
                        sets: true,
                        exercise: true
                    }
                }
            }
        });
        if (!routineById) {
            return null;
        }
        return routineById;
    } catch(error) {
        console.log(error);
    }
}