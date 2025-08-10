'use client';
import { useState, useEffect, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { useExercisesListStore } from "../store/exercisesStore";
import { WorkoutExercise, Workout, MuscleGroupWithExercises } from "../lib/definitions";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface ExercisesPerMuscleGroupChartProps {
  allWorkouts: Workout[];
  availableYears: number[];
  defaultYear?: number;
  muscleGroups: MuscleGroupWithExercises[];
}

export default function ExercisesPerMuscleGroupChart({allWorkouts, availableYears, defaultYear, muscleGroups}: ExercisesPerMuscleGroupChartProps) {
    
    const [selectedYear, setSelectedYear] = useState<number>(defaultYear || new Date().getFullYear());

    const filteredWorkoutsByYear = useMemo(() => {
        return allWorkouts.filter((workout) => {
            const workoutYear = new Date(workout.date).getFullYear();
            return workoutYear === selectedYear;
        })
    }, [allWorkouts, selectedYear]);

    const exerciseIdToGroupIndex = useMemo(() => {
        if (!muscleGroups) return new Map<number, number>();
        
        const map = new Map<number, number>();
        
        muscleGroups.forEach((muscleGroup, groupIndex) => {
            muscleGroup.exercises.forEach(exercise => {
                map.set(exercise.id, groupIndex);
            });
        });
        
        return map;
    }, [muscleGroups]);

    const muscleGroupData = useMemo(() => {
        if (!allWorkouts || !muscleGroups || allWorkouts.length === 0) {
            return {
                names: [],
                counts: []
            };
        }

        const counts = new Array(muscleGroups.length).fill(0);
        const names = muscleGroups.map(group => group.name);

        // More efficient counting using the Map
        filteredWorkoutsByYear.forEach(workout => {
            workout.workoutExercises?.forEach((workoutExercise: WorkoutExercise) => {
                const groupIndex = exerciseIdToGroupIndex.get(workoutExercise.exerciseId);
                if (groupIndex !== undefined) {
                    counts[groupIndex]++;
                }
            });
        });

        return { names, counts };
    }, [filteredWorkoutsByYear]);

    return (
        <section className="h-[260px] w-[260px] flex flex-col justify-center items-start">
            <div className="mb-3">
                <label className="text-[14px]">Select Year:</label>
                <select
                    className="text-[12px] ml-1 bg-gray-50 rounded-sm border-1"
                    value={selectedYear ?? ''}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                    {availableYears?.map((year) => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <Doughnut 
                data={{
                    labels: muscleGroupData.names,
                    datasets: [
                        {
                            label: "Exercises: ",
                            data: muscleGroupData.counts,
                            borderColor: ["red", "blue", "yellow", "green", "black"],
                            backgroundColor: ["red", "blue", "yellow", "green", "black"]
                        }
                    ],
                }}
                options={{
                    plugins: {
                        legend: {
                            position: "bottom",
                            align: 'start',
                        }
                    }
                }}
            />
        </section>
    )
}