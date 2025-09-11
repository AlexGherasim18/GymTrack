import { DateTime } from "next-auth/providers/kakao";

export type User = {
    id : number;
    email: string;
    username: string;
    password: string;
    role: "user" | "admin";
    workouts: Workout[]
}

export type CreateUserResult = {
    success: boolean;
    error?: string;
    user?: {
        id: number;
        username: string;
        email: string;
        password: string;
        role: "user" | "admin";
    };
}

export type Workout = {
    id: number;
    name: string;
    date: DateTime;
    workoutExercises: WorkoutExercise[];
}

export type WorkoutToEdit = {
    id: number;
    name: string;
    date: DateTime;
    userId?: number;
    workoutExercises: {
        id: number;
        exerciseId: number;
        workoutId: number;
        sets: {
            id: number;
            setNumber: number;
            reps: number;
            weight: number;
            workoutExerciseId: number;
        }[];
        exercise: {
            id: number;
            name: string;
            description: string;
            imageUrl: string;
        };
    }[];
};

export type RoutineToSubmit = {
    id: number;
    name: string;
    date: DateTime;
    userId?: number;
    routineExercises: {
        id: number;
        exerciseId: number;
        routineId: number;
        sets: {
            id: number;
            setNumber: number;
            reps: number;
            weight: number;
            routineExerciseId: number;
        }[];
        exercise: {
            id: number;
            name: string;
            description: string;
            imageUrl: string;
        };
    }[];
};

export type Exercise = {
    id: number;
    name: string;
    description?: string;
    imageUrl: string;
}
export type WorkoutExercise = {
    id: number;
    exerciseId: number;
    name: string;
    description?: string;
    imageUrl: string;
    sets: SetInput[]
}

export type RoutineExercise = {
    id: number;
    exerciseId: number;
    name: string;
    description?: string;
    imageUrl: string;
    sets: SetInput[]
}

export type MuscleGroupWithExercises = {
    id: number;
    name: string;
    exercises: Exercise[];
}

export type SetInput = {
    setNumber: number;
    reps: number;
    weight: number;
}

export type ExerciseInput = {
    exerciseId: number;
    sets: SetInput[];
}

export type DashboardWorkout = {
    id: number;
    name: string;
    date: DateTime;
    userId: number;
}

export type DashboardRoutine = {
    id: number;
    name: string;
    userId: number;
}