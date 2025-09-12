import { PrismaClient } from "../generated/prisma";
import { ExerciseInput } from "./definitions";

const prisma = new PrismaClient();

export async function editWorkout(
    workoutId: number,
    workoutName: string,
    workoutDate: Date,
    userId: number,
    workoutExercises: ExerciseInput[]
) {
    try {
        const updatedWorkout = await prisma.workout.update({
            where: {
                id: workoutId,
                userId: userId
            },
            data: {
                name: workoutName,
                date: workoutDate,
                workoutExercises: {
                    deleteMany: {},
                    create: workoutExercises.map((exercise, idx) => ({
                        exercise: { connect: { id: exercise.exerciseId } },
                        order: idx,
                        sets: {
                            create: exercise.sets.map((set) => ({
                                setNumber: set.setNumber,
                                reps: set.reps,
                                weight: set.weight
                            }))
                        }
                    }))
                }
            }
        });
        return { success: true, updatedWorkout };
    } catch(error) {
        return { success: false, error };
    }
}