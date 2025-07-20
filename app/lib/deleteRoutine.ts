import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function deleteRoutine(routineId: number, userId: number) {
    try {
        const removedRoutine = await prisma.routine.delete({
            where: {
                id: routineId,
                userId: userId,
            }
        });
        if (!removedRoutine) {
            return null;
        }
        return removedRoutine;
    } catch (error) {
        console.log("Error deleting workout:", error);
        return null;
    }
}