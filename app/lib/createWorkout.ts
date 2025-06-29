import { PrismaClient } from "../generated/prisma";
import { ExerciseInput } from "./definitions";

const prisma = new PrismaClient();

export async function createWorkout(
  userId: number,
  workoutName: string,
  workoutDate: Date,
  workoutExercises: ExerciseInput[]
) {
  try {
    const workout = await prisma.workout.create({
      data: {
        name: workoutName,
        date: workoutDate,
        user: { connect: { id: userId } },
        workoutExercises: {
          create: workoutExercises.map((exercise) => ({
            exercise: { connect: { id: exercise.exerciseId } },
            sets: {
              create: exercise.sets.map((set) => ({
                setNumber: set.setNumber,
                reps: set.reps,
                weight: set.weight,
              })),
            },
          })),
        },
      },
    });

    return { success: true, workout };
  } catch (error) {
    return { success: false, error };
  }
}