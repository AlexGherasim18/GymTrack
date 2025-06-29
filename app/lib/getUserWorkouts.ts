import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function getUserWorkouts(currentUserId: number) {
    try {
        const workouts = await prisma.workout.findMany({
            where: {
                userId: currentUserId,
            },
            include: {
                workoutExercises: {
                    include: {
                        sets: true,
                    },
                },
            },
            orderBy: {
                date: 'desc',
            }
        });
        return workouts;
    } catch(error) {
        console.log(error)
    }
}