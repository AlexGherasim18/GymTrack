'use client';

import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title } from "chart.js";
import { Line } from "react-chartjs-2";
import { WorkoutExercise, Workout, MuscleGroupWithExercises } from "../lib/definitions";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Input from "./input";
import { useState, useMemo } from "react";
import Button from "./button";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

interface MaxWeightPerMonthChartProps {
    allWorkouts: Workout[];
    availableYears: number[];
    defaultYear?: number;
    muscleGroups: MuscleGroupWithExercises[];
}

export default function MaxWeightPerMonthChart({allWorkouts, availableYears, defaultYear, muscleGroups}: MaxWeightPerMonthChartProps) {
    const [selectedYear, setSelectedYear] = useState<number>(defaultYear || new Date().getFullYear());
    const [showExercises, setShowExercises] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [selectedExercise, setSelectedExercise] = useState<{id: number, name: string} | null>(null);

    const filteredExercises = useMemo(() => {
        if(!muscleGroups || muscleGroups.length === 0) return [];

        if(!searchTerm.trim()) {
            return muscleGroups;
        };

        const searchLowerCase = searchTerm.toLowerCase().trim();

        const filtered = muscleGroups.map(group => {

            const muscleGroupNameMatches = group.name.toLowerCase().includes(searchLowerCase);

            if(muscleGroupNameMatches) {
                return group;
            } else {
                const matchingExercises = group.exercises.filter(exercise => {
                    return exercise.name.toLowerCase().includes(searchLowerCase);
                });
    
                return {...group, exercises: matchingExercises}
            }

        }).filter(group => group.exercises.length > 0);

        return filtered;
    }, [muscleGroups, searchTerm]);

    const filteredWorkoutsByYear = useMemo(() => {
        return allWorkouts.filter((workout) => {
            const workoutYear = new Date(workout.date).getFullYear();
            return workoutYear === selectedYear;
        })
    }, [allWorkouts, selectedYear]);

    const maxWeightPerMonth = useMemo(() => {
        if(!selectedExercise || filteredWorkoutsByYear.length === 0) {
            return Array(12).fill(0);
        }

        const monthlyMaxWeights = Array(12).fill(0);

        filteredWorkoutsByYear.forEach(workout => {
            const workoutMonth = new Date(workout.date).getMonth();

            workout.workoutExercises?.forEach(workoutExercise => {
                if(workoutExercise.exerciseId === selectedExercise.id) {
                    if(workoutExercise.sets && workoutExercise.sets.length > 0) {
                        const maxWeightInWorkout = Math.max(...workoutExercise.sets.map(set => set.weight));

                        if(maxWeightInWorkout > monthlyMaxWeights[workoutMonth]) {
                            monthlyMaxWeights[workoutMonth] = maxWeightInWorkout;
                        }
                    }
                }
            });
        });

        return monthlyMaxWeights;
    },[filteredWorkoutsByYear, selectedExercise])

    console.log(maxWeightPerMonth);
    console.log(filteredWorkoutsByYear)

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const typedTerm = event.target.value;
        setSearchTerm(typedTerm);
    };

    const handleExerciseSelect = (exercise: {id: number, name: string}) => {
        setSelectedExercise(exercise);
        setShowExercises(false);
        setSearchTerm(""); // Reset search when exercise is selected
    };

    const handleToggleDropdown = () => {
        setShowExercises(!showExercises);
        if (showExercises) {
            setSearchTerm(""); // Reset search when closing
        }
    };

    return (
        <section 
            className="
                relative 
                w-full 
                max-w-[500px] 
                mx-auto 
                px-2 
                sm:px-4 
                md:px-0 
                flex 
                flex-col 
                items-center">
            <section 
                className="
                    filters-section
                    flex
                    flex-col
                    items-start
                    gap-2
                    w-full
                    xl:flex-row xl:justify-between xl:items-center
                "
            >
                <div className="mb-3 w-[170px] xl:w-auto flex justify-start">
                    <Button onClick={handleToggleDropdown} className="search-exercise h-[30px] pl-[10px] w-[170px] flex justify-between">
                        <p className="text-[13px]">Select Exercise</p>
                        <ChevronDownIcon className="w-[15px] h-[15px]"/>
                    </Button>
                </div>
                <div 
                    className="
                        mb-3 
                        w-[170px] 
                        xl:w-auto 
                        xl:flex 
                        flex-row 
                        items-center 
                        justify-start
                        ">
                    <label className="text-[14px]">Select Year:</label>
                    <select
                        className="text-[12px] ml-1 bg-gray-50 rounded-sm border-1 w-[110px]"
                        value={selectedYear ?? ''}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                    >
                        {availableYears?.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </section>
            {showExercises && <section className="absolute top-12 left-0 flex flex-col w-full max-w-[420px] h-[280px] bg-white py-3 overflow-y-auto border-1 z-20">
                <Input className="sticky top-0 z-10 bg-white search-exercise h-[30px] pl-[10px] w-full max-w-[300px] mx-auto" type="text" name="search-exercise" id="search-exercise" placeholder="Search Exercise" value={searchTerm} onChange={handleSearchChange}/>
                {filteredExercises?.map((group) => (
                    <div key={group.id} className="bg-gray-50">
                        <h2 className="font-semibold text-[16px] mt-3 pl-2">{group.name}</h2>
                        <ul className="w-full flex flex-col">
                            {group.exercises.map((exercise) => (
                                <li key={exercise.id} onClick={() => handleExerciseSelect({id: exercise.id, name: exercise.name})} className="w-full h-[50px] flex flex-row py-[30px] border-t-1 font-semibold items-center text-[12px] hover:cursor-pointer hover:bg-gray-100 hover:text-[14px]">
                                    <img className="w-[60px] h-[40px] sm:w-[100px] sm:h-[50px]" src={exercise.imageUrl} alt={exercise.name} />
                                    <p className="text-center leading-snug mx-auto">{exercise.name}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>}
            <div className="w-full h-[180px] sm:h-[220px] md:h-[240px]">
                <Line 
                    data={{
                        labels: monthLabels,
                        datasets: [
                            {
                                label: selectedExercise ? `Max Weight - ${selectedExercise.name}` : "Select An Exercise",
                                data: maxWeightPerMonth,
                                backgroundColor: "#3b82f6",
                                borderColor: "#3b82f6"
                            }
                        ]
                    }}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                    }}
                />
            </div>
        </section>
    )
}