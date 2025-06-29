import { create } from "zustand";
import { MuscleGroupWithExercises } from "../lib/definitions";

type ExercisesListStore = {
    muscleGroups: MuscleGroupWithExercises[];
    fetchExercisesList: () => Promise<void>;
}

export const useExercisesListStore = create<ExercisesListStore>((set) => ({
    muscleGroups: [],
    fetchExercisesList: async() => {
        const response = await fetch("/api/exercises");
        const data = await response.json();
        set({muscleGroups: data});
    }
}));