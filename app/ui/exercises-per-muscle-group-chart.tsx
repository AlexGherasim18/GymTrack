'use client';
import { useState, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Doughnut } from "react-chartjs-2";
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
    }, [filteredWorkoutsByYear, allWorkouts, exerciseIdToGroupIndex, muscleGroups]);

    return (
        <section 
            className="
                flex 
                flex-col 
                justify-center 
                items-center 
                mx-auto 
                w-full 
                max-w-[420px] 
                px-2 
                sm:px-4 
                md:px-0">
            <div className="mb-3 w-full flex justify-center">
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
            <div
                className="
                    w-full
                    max-w-[420px]
                    max-h-[280px]
                    min-w-[180px]
                    min-h-[120px]
                    flex 
                    justify-center 
                    items-center
                    sm:w-[60vw]
                    sm:h-[40vw]
                    md:w-[420px]
                    md:h-[280px]
                    lg:max-w-[420px]
                    lg:max-h-[280px]
                    "
            >
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
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "bottom",
                                align: 'center',
                                labels: {
                                    font: {
                                        size: 10
                                    },
                                    boxWidth: 12,
                                    boxHeight: 12,
                                    padding: 10,
                                    usePointStyle: true,
                                },
                                display: true,
                                fullSize: false,
                            }
                        }
                    }}
                />
            </div>
        </section>
    )
}