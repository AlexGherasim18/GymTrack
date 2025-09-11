import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function getLastFiveUserRoutines(currentUserId: number) {
    try {
        const lastFiveRoutines = await prisma.routine.findMany({
            where: {
                userId: currentUserId,
            },
            orderBy: {
                id: 'desc',
            },
            take: 5,
        })
        return lastFiveRoutines;
    } catch(error) {
        console.log(error);
    }
}