'use server'
import { AuthError } from "next-auth";
import { signIn, signOut } from "./auth";
import { z } from "zod";
import { createWorkout } from "./createWorkout";
import { auth } from "./auth";
import { getUserWorkouts } from "./getUserWorkouts";

export async function authenticate(
    prevState: {error: string | null, success: boolean} | undefined,
    formData: FormData
) {
    const username = formData.get('username')?.toString() || ''
    const password = formData.get('password')?.toString() || ''
    try {
        await signIn('credentials', {
            redirect: false,
            username,
            password,
        });
        return {error: null, success: true};
    } catch (error) {
        if (error instanceof AuthError) {
            switch(error.type) {
                case 'CredentialsSignin':
                    return { error: "Invalid username or password.", success: false };
                default:
                    return { error: "Something went wrong.", success: false };
            }
        }
    }
}

export async function logout() {
    await signOut({redirectTo: "/login"})
}

const WorkoutSchema = z.object({
    workoutName: z.string().min(3, "Workout name must be at least 3 characters"),
    workoutDate: z.coerce.date({required_error: "Workout date is required."})
        .refine(date => {
            const today = new Date();
            today.setHours(23,59,59,999);
            return date <= today;
        }),
    userId: z.string(),
    workoutExercises: z.array(z.object({
        exerciseId: z.number(),
        exerciseName: z.string(),
        imageUrl: z.string(),
        sets: z.array(z.object({
            setNumber: z.number().min(1),
            reps: z.number().min(1, "Reps must be at least 1."),
            weight: z.number().min(0, "Weight must be 0 or greater.")
        })).min(1, "Each exercise must have at least one set.")
    })).min(1, "You must add at least one exercise.")
})

export async function addWorkout(
    prevState: {error: string | null, success: boolean} | undefined,
    formData: FormData
) {
    const session = await auth();

    const userId = Number(session?.user.id);
    const rawWorkoutName = formData.get('workout-name') as string;
    const rawWorkoutDateString = formData.get('workout-date') as string;
    const rawWorkoutDate = new Date(rawWorkoutDateString);
    const rawSelectedExercises = JSON.parse(formData.get("workoutExercises") as string);

    const parsed = WorkoutSchema.safeParse({
        workoutName: rawWorkoutName,
        workoutDate: rawWorkoutDate,
        userId: String(userId),
        workoutExercises: rawSelectedExercises
    })

    if (!parsed.success) {
        const zodErrors = parsed.error.flatten().fieldErrors;
        return {
            error: null,
            success: false,
            validationErrors: zodErrors
        };
    }

    const {workoutName, workoutDate, workoutExercises} = parsed.data;

    const result = await createWorkout(userId, workoutName, workoutDate, workoutExercises);

    if(!result.success) {
        return { error: "Failed to create workout", success: false };
    }

    return { error: null, success: true, workout: result.workout };
}