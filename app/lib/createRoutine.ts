import { success } from "zod/v4";
import { PrismaClient } from "../generated/prisma";
import { ExerciseInput } from "./definitions";

const prisma = new PrismaClient();

export async function createRoutine(
    userId: number,
    routineName: string,
    routineExercises: ExerciseInput[]
) {
    try {
        const routine = await prisma.routine.create({
            data: {
                name: routineName,
                user: { connect: { id: userId } },
                routineExercises: {
                    create: routineExercises.map((exercise, index) => ({
                        exercise: { connect: { id: exercise.exerciseId } },
                        order: index,
                        sets: {
                            create: exercise.sets.map((set) => ({
                                setNumber: set.setNumber,
                                reps: set.reps,
                                weight: set.weight
                            })),
                        },
                    })),
                },
            },
        });

        return { success: true, routine };
    } catch(error) {
        return { success: false, error };
    }
}