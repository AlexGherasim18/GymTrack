import { DateTime } from "next-auth/providers/kakao";

export type User = {
    id : number;
    email: string;
    username: string;
    password: string;
    role: "user" | "admin";
    workouts: Workout[]
}

export type Workout = {
    id: number;
    name: string;
    date: DateTime;
    workoutExercises: WorkoutExercise[];
}

export type Exercise = {
    id: number;
    name: string;
    description?: string;
    imageUrl: string;
}
export type WorkoutExercise = {
    id: number;
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