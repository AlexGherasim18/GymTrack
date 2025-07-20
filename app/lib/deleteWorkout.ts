import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

export async function deleteWorkout(workoutId: number, userId: number) {
    try {
        const removedWorkout = await prisma.workout.delete({
            where: {
                id: workoutId,
                userId: userId,
            }
        });
        if (!removedWorkout) {
            return null;
        }
        return removedWorkout;
    } catch (error) {
        console.log("Error deleting workout:", error);
        return null;
    }
}