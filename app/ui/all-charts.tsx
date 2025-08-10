'use client';

import { useState, useEffect, useMemo } from "react";
import { Workout } from "../lib/definitions";
import MonthlyWorkoutsChart from "./monthly-workouts-chart";
import MyLineChart from "./linechart";
import { useExercisesListStore } from "../store/exercisesStore";
import ExercisesPerMuscleGroupChart from "./exercises-per-muscle-group-chart";

export default function AllCharts() {
    const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
    const {muscleGroups, fetchExercisesList} = useExercisesListStore();

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const response = await fetch("/api/workouts");
                if(!response.ok) {
                    throw new Error(`HTTP Error! Status: ${response.status}`)
                }
                const data: Workout[] = await response.json();
                setAllWorkouts(data);
            } catch(error) {
                console.log(error);
            }
        };
        fetchWorkouts();
        fetchExercisesList();
    }, []);
    
    const availableYears = useMemo(() => {
        if(allWorkouts.length === 0) return [];

        const years = allWorkouts.map((workout) => new Date(workout.date).getFullYear());
        return [...new Set(years)].sort((a, b) => b - a);
    }, [allWorkouts]);
    
    const defaultYear = availableYears[0];

    return (
        <section className="flex flex-col gap-10">
            <MonthlyWorkoutsChart
                allWorkouts = {allWorkouts}
                availableYears = {availableYears}
                defaultYear = {defaultYear}
            />
            <MyLineChart
                allWorkouts = {allWorkouts}
                availableYears = {availableYears}
                defaultYear = {defaultYear}
                muscleGroups = {muscleGroups}
            />
            <ExercisesPerMuscleGroupChart 
                allWorkouts = {allWorkouts}
                availableYears = {availableYears}
                defaultYear = {defaultYear}
                muscleGroups = {muscleGroups}
            />
        </section>
    )
}