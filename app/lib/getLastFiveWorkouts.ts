import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function getLastFiveUserWorkouts(currentUserId: number) {
    try {
        const lastFiveWorkouts = await prisma.workout.findMany({
            where: {
                userId: currentUserId,
            },
            orderBy: {
                date: 'desc',
            },
            take: 5,
        })
        return lastFiveWorkouts;
    } catch(error) {
        console.log(error);
    }
}