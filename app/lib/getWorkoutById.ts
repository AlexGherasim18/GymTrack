import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function getWorkoutById(workoutId: number, userId: number) {
    try {
        const workoutById = await prisma.workout.findUnique({
            where: {
                id: workoutId,
                userId: userId,
            },
            include: {
                workoutExercises: {
                    include: {
                        sets: true,
                        exercise: true
                    }
                }
            }
        });
        if (!workoutById) {
            return null;
        }
        return workoutById;
    } catch(error) {
        console.log(error);
    }
}