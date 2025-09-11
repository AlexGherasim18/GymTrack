'use client';

import { useState, useEffect, useMemo } from "react";
import { Workout } from "../lib/definitions";
import MonthlyWorkoutsChart from "./monthly-workouts-chart";
import MaxWeightPerMonthChart from "./max-weight-per-month-chart";
import { useExercisesListStore } from "../store/exercisesStore";
import ExercisesPerMuscleGroupChart from "./exercises-per-muscle-group-chart";
import SkeletonLoading from "./skeleton-loading";

export default function AllCharts() {
    const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
    const [isDataReady, setIsDataReady] = useState(false);
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
                setIsDataReady(true);
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
        <section
            className="
                flex flex-col items-center
                md:grid md:grid-cols-2 md:grid-rows-2
                gap-6 md:gap-10
                w-full
                h-[calc(100vh-2rem)]
                overflow-y-auto overflow-x-hidden
                px-2
                min-h-[600px]
                max-h-[calc(100vh-2rem)]
            "
        >
            {isDataReady 
                ? 
                    ( <MonthlyWorkoutsChart
                        allWorkouts = {allWorkouts}
                        availableYears = {availableYears}
                        defaultYear = {defaultYear}
                    /> ) 
                : 
                    ( 
                        <section className="w-full max-w-[540px] col-span-2 mx-auto px-2 flex flex-col items-center h-64 ">
                            <SkeletonLoading /> 
                        </section>
                    )}
            {isDataReady 
                ? 
                    ( <MaxWeightPerMonthChart
                        allWorkouts = {allWorkouts}
                        availableYears = {availableYears}
                        defaultYear = {defaultYear}
                        muscleGroups = {muscleGroups}
                    /> ) 
                :   ( 
                        <SkeletonLoading />
                    )}
            {isDataReady ? (<ExercisesPerMuscleGroupChart 
                allWorkouts = {allWorkouts}
                availableYears = {availableYears}
                defaultYear = {defaultYear}
                muscleGroups = {muscleGroups}
            /> ) : ( <SkeletonLoading /> )}
        </section>
    )
}