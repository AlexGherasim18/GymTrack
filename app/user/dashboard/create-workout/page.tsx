'use client';

import { useEffect } from "react";
import { useExercisesListStore } from "@/app/store/exercisesStore";
import CreateWorkoutForm from "@/app/ui/create-workout-form";

export default function CreateWorkout() {
    const {muscleGroups, fetchExercisesList} = useExercisesListStore();

    useEffect(() => {
        fetchExercisesList();
    }, [fetchExercisesList])

    return (
        <CreateWorkoutForm/>
    )
}