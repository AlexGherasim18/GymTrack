'use server'
import { AuthError } from "next-auth";
import { signIn, signOut } from "./auth";
import { z } from "zod";
import { createWorkout } from "./createWorkout";
import { createRoutine } from "./createRoutine";
import { auth } from "./auth";
import { editWorkout } from "./editWorkout";
import { createUser } from "./createUser";
import { getUser } from "./auth";
import bcrypt from "bcryptjs";

export async function authenticate(
    prevState: {error: string | null, success: boolean} | undefined,
    formData: FormData
) {
    const username = formData.get('username')?.toString() || ''
    const password = formData.get('password')?.toString() || ''
    try {
        const result = await signIn('credentials', {
            redirect: false,
            username,
            password,
        });

        if (result?.error) {
            return { error: "Invalid username or password.", success: false };
        }

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

        return { error: "Something went wrong.", success: false };
    }
}

export async function logout() {
    await signOut({redirectTo: "/login"})
}

const WorkoutSchema = z.object({
    workoutName: z.string().min(3, "Workout name must be at least 3 characters."),
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

const RoutineSchema = z.object({
    routineName: z.string().min(3, "Routine name must be at least 3 characters."),
    userId: z.string(),
    routineExercises: z.array(z.object({
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

const UserSchema = z.object({
    username: z.string().min(3, "Username must have at least 3 characters."),
    email: z.string().email("Invalid email address."),
    password: z.string().min(4, "Password must have at least 4 characters.")
})

type RegisterState = {
    error: string | null;
    success: boolean;
    validationErrors?: {
        username?: string[];
        email?: string[];
        password?: string[];
    };
    user?: {
        id: number;
        username: string;
        email: string;
        role: string;
    };
};

export async function register(
    state: RegisterState | undefined,
    formData: FormData
): Promise<RegisterState> {
    const rawUsername = formData.get('username')?.toString() || '';
    const rawEmail = formData.get('email')?.toString() || '';
    const rawPassword = formData.get('password')?.toString() || '';

    const parsed = UserSchema.safeParse({
        username: rawUsername,
        email: rawEmail,
        password: rawPassword
    });

    if(!parsed.success) {
        const zodErrors = parsed.error.flatten().fieldErrors;

        return {
            error: null,
            success: false,
            validationErrors: zodErrors,
        }
    };


    const { username, email, password } = parsed.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await createUser(username, email, hashedPassword);

    if(!result.success) {
        return { error: result.error || "Failed to create user", success: false, validationErrors: undefined, user: undefined };
    }

    return { error: null, success: true, validationErrors: undefined, user: result.user };
}

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

export async function updateWorkout(
    prevState: {error: string | null, success: boolean} | undefined,
    formData: FormData
) {
    const session = await auth();

    const userId = Number(session?.user.id);
    const workoutId = Number(formData.get('workout-id'));
    const rawWorkoutName = formData.get('workout-name') as string;
    const rawWorkoutDateString = formData.get('workout-date') as string;
    const rawWorkoutDate = new Date(rawWorkoutDateString);
    const rawSelectedExercises = JSON.parse(formData.get("workoutExercises") as string);

    const parsed = WorkoutSchema.safeParse({
        workoutName: rawWorkoutName,
        workoutDate: rawWorkoutDate,
        userId: String(userId),
        workoutExercises: rawSelectedExercises
    });

    if (!parsed.success) {
        const zodErrors = parsed.error.flatten().fieldErrors;
        return {
            error: null,
            success: false,
            validationErrors: zodErrors
        };
    };

    const {workoutName, workoutDate, workoutExercises} = parsed.data;

    const result = await editWorkout(workoutId, workoutName, workoutDate, userId, workoutExercises);

    if(!result.success) {
        return { error: "Failed to update workout", success: false };
    };

    return { error: null, success: true, workout: result.updatedWorkout };
}

export async function addRoutine (
    prevState: {error: string | null, success: boolean} | undefined,
    formData: FormData
) {
    const session = await auth();

    const userId = Number(session?.user.id);
    const rawRoutineName = formData.get('routine-name') as string;
    const rawSelectedExercises = JSON.parse(formData.get('routine-exercises') as string);

    const parsed = RoutineSchema.safeParse({
        routineName: rawRoutineName,
        userId: String(userId),
        routineExercises: rawSelectedExercises
    });

    if (!parsed.success) {
        const zodErrors = parsed.error.flatten().fieldErrors;
        return {
            error: null,
            success: false,
            validationErrors: zodErrors
        };
    };

    const { routineName, routineExercises } = parsed.data;

    const result = await createRoutine(userId, routineName, routineExercises);

    if(!result.success) {
        return { error: "Failed to create routine", success: false };
    }

    return { error: null, success: true, workout: result.routine };
}