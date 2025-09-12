'use client';

import Form from "./form";
import Input from "./input";
import Button from "./button";
import PopUp from "./popup";
import { useState, useActionState, useEffect } from "react";
import { addWorkout } from "../lib/actions";
import { WorkoutExercise } from "../lib/definitions";
import { TrashIcon, PlusIcon, MinusIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function CreateWorkoutForm() {
    const [displayPopUp, setDisplayPopUp] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([])
    const [state, formAction] = useActionState(addWorkout, undefined);
    const [showSuccess, setShowSuccess] = useState(false);

    const router = useRouter();
    const today = new Date().toISOString().split('T')[0];

    const [workoutName, setWorkoutName] = useState("");
    const [workoutDate, setWorkoutDate] = useState(today);

    useEffect(() => {
        if(state?.success) {
            setShowSuccess(true);
            setSelectedExercises([]);
            
            const timeout = setTimeout(() => {
                setShowSuccess(false);
                router.push("/user/workouts");
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [state?.success, router]);
    
    const handleAddSet = (exerciseIndex: number) => {
        setSelectedExercises((exercisesList) => 
            exercisesList.map((exercise, index) => index === exerciseIndex 
                ? {
                    ...exercise, 
                    sets: [
                        ...exercise.sets, 
                        {setNumber: exercise.sets.length + 1, reps: 0, weight: 0}
                    ]
                } : exercise
            )
        );
    };

    const handleSetChange = (
        exerciseIndex: number,
        setIndex: number,
        field: 'reps' | 'weight',
        value: number
    ) => {
        setSelectedExercises((exercisesList) =>
            exercisesList.map((exercise, index) => index === exerciseIndex
                ? {
                    ...exercise,
                    sets: exercise.sets.map((set, index) => index === setIndex ? {...set, [field]: value} : set)
                } : exercise
            )
        )
    }

    const handleRemoveExercise = (exerciseToRemoveIndex: number) => {
        setSelectedExercises(exercisesList => [
            ...exercisesList.slice(0, exerciseToRemoveIndex),
            ...exercisesList.slice(exerciseToRemoveIndex + 1),
        ]);
    };

    const handleRemoveSet = (exerciseIndex: number, setIndex: number) => {
        setSelectedExercises((exercisesList) => 
            exercisesList.map((exercise, i) => 
                i === exerciseIndex
                    ? {
                        ...exercise,
                        sets: exercise.sets.filter((_, index) => index !== setIndex),
                    } : exercise
            )
        );
    };

    return (
        <>
            {!displayPopUp ? <Form action={formAction} className="max-w-[400px] mx-auto mt-10 max-h-screen overflow-hidden">
                <label htmlFor="workout-name" className="max-[657px]:text-[14px]">Workout Name:</label>
                <Input className="w-full" type="text" name="workout-name" id="workout-name" placeholder="E.g: Push Workout" value={workoutName} onChange={e => setWorkoutName(e.target.value)} required/>
                {state?.validationErrors?.workoutName && (
                    <p className="text-red-500 text-sm mt-1">{state.validationErrors.workoutName[0]}</p>
                )}

                <label htmlFor="workout-date" className="max-[657px]:text-[14px]">Workout Date:</label>
                <Input className="w-full" type="date" name="workout-date" id="workout-date" max={today} value={workoutDate} onChange={e => setWorkoutDate(e.target.value)} required/>
                {state?.validationErrors?.workoutDate && (
                    <p className="text-red-500 text-sm mt-1">{state.validationErrors.workoutDate[0]}</p>
                )}

                {selectedExercises.length > 0 && (
                    <ul className="w-full flex flex-col gap-2 mt-2 overflow-y-auto max-h-[320px]">
                        {selectedExercises.map((exercise, exerciseIndex) => (
                            <li key={exerciseIndex} id={exercise.id.toString()} className="bg-gray-300 w-full flex flex-col">
                                <div className="exerciseName flex flex-row justify-start items-center gap-3 py-1 px-2 text-[14px]">
                                    <p className="max-[315px]:text-[12px]">{exercise.name}</p>
                                    <TrashIcon onClick={() => handleRemoveExercise(exerciseIndex)} 
                                        className="
                                            w-5 
                                            h-5 
                                            p-[2px] 
                                            bg-gray-400 
                                            rounded-full  
                                            cursor-pointer 
                                            hover:bg-gray-500
                                            
                                            max-[315px]:w-4
                                            max-[315px]:h-4"/>
                                </div>
                                {exercise.sets?.length > 0 && (
                                    <ul className="setsList">
                                        {exercise.sets.map((set, setIndex) => (
                                            <li key={setIndex} 
                                                className="
                                                    flex 
                                                    flex-row 
                                                    justify-around 
                                                    items-center 
                                                    mb-2 
                                                    text-[14px]
                                                    
                                                    max-[657px]:text-[12px]
                                                    
                                                    max-[315px]:flex-col
                                                    max-[315px]:items-start
                                                    max-[315px]: gap-1">
                                                <p className="w-auto ml-2">Set {setIndex+1}:</p>
                                                <div 
                                                    className="
                                                        flex
                                                        flex-row
                                                        items-center
                                                        gap-2
                                                        
                                                        max-[315px]:flex-wrap
                                                        max-[315px]:ml-2">
                                                    <label htmlFor="reps">Reps: </label>
                                                    <Input className="no-spinner w-[40px] py-[0px] pl-[5px] max-[315px]:w-[25px] max-[315px]:pl-[3px]" type="number" min="1" name="reps" id="reps" value={set.reps === 0 ? "" : set.reps} onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', Number(e.target.value))} onFocus={e => {
                                                        if(e.target.value === "0") {
                                                            e.target.value = ""
                                                        }
                                                    }} required/>
                                                    <label htmlFor="weight">Weight (kg): </label>
                                                    <Input className="no-spinner w-[40px] py-[0px] pl-[5px] max-[315px]:w-[25px] max-[315px]:pl-[3px]" type="number" min="0" name="weight" id="weight" value={set.weight === 0 ? "" : set.weight} onFocus={e => {
                                                        if(e.target.value === "0") {
                                                            e.target.value = ""
                                                        }
                                                    }} onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', Number(e.target.value))}/>
                                                    <MinusIcon onClick={() => handleRemoveSet(exerciseIndex, setIndex)} 
                                                        className="
                                                            bg-gray-400 
                                                            w-4 
                                                            h-4 
                                                            rounded-full 
                                                            cursor-pointer 
                                                            hover:bg-red-700
                                                            
                                                            max-[315px]:w-3
                                                            max-[315px]:h-3"/>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <Button type="button" onClick={() => handleAddSet(exerciseIndex)} 
                                    className="
                                        mt-[0px] 
                                        mb-1 
                                        text-[14px] 
                                        py-[0px] 
                                        h-[30px] 
                                        w-[130px] 
                                        rounded-[8px]
                                        flex
                                        flex-row
                                        items-center
                                        justify-center
                                        
                                        max-[315px]:max-w-[100px]
                                        max-[315px]:text-[12px]">
                                    <PlusIcon className="w-5 max-[315px]:hidden"/>
                                    <p>Add Set</p>
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}

                {state?.validationErrors?.workoutExercises && (
                    <p className="text-red-500 text-sm mt-2">{state.validationErrors.workoutExercises[0]}</p>
                )}

                <Button type="button" onClick={() => setDisplayPopUp(true)} className="justify-center my-2 text-[14px] py-[0px] h-[30px] w-[140px] rounded-[8px] bg-gray-900 hover:bg-gray-500">
                    Add Exercise
                </Button>
                <input type="hidden" name="workoutExercises" value={JSON.stringify(
                    selectedExercises.map((exercise) => ({
                        exerciseId: exercise.id,
                        exerciseName: exercise.name,
                        imageUrl: exercise.imageUrl,
                        sets: exercise.sets
                    }))
                )} />
                {showSuccess && (
                    <p className="text-green-600 text-center mb-4">
                        Workout logged successfully!
                    </p>
                )}
                <Button type="submit">Submit</Button>
            </Form> : <PopUp 
                        onClose={() => setDisplayPopUp(false)} 
                        onSelectExercise={(exercise) => {
                            setSelectedExercises((prev) => [...prev, {...exercise, exerciseId: exercise.id, sets: [{setNumber: 1, reps: 0, weight: 0}]}]);
                            setDisplayPopUp(false);
                            }
                        }
            />}
        </>
    )
}