'use client';

import Input from "./input";
import Button from "./button";
import Form from "./form";
import PopUp from "./popup";
import { useActionState, useState, useEffect } from "react";
import { WorkoutExercise } from "../lib/definitions";
import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { addRoutine } from "../lib/actions";
import { useRouter } from "next/navigation";

export default function CreateRoutineForm() {
    const [displayPopUp, setDisplayPopUp] = useState(false);
    const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>([]);
    const [state, formAction] = useActionState(addRoutine, undefined);
    const [showSuccess, setShowSuccess] = useState(false);

    const router = useRouter();

    useEffect(() => {
        if(state?.success) {
            setShowSuccess(true);
            setSelectedExercises([]);
            
            const timeout = setTimeout(() => {
                setShowSuccess(false);
                router.push("/user/routines");
            }, 2000);
            return () => clearTimeout(timeout);
        }
    }, [state?.success])

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
            {!displayPopUp ? <Form action={formAction} className="w-[400px] mx-auto mt-10 max-h-screen overflow-hidden">
                <label htmlFor="routine-name">Routine Name:</label>
                <Input className="w-full" type="text" name="routine-name" id="routine-name" placeholder="E.g: Push Day" required/>
                {state?.validationErrors?.routineName && (
                    <p className="text-red-500 text-sm mt-1">{state.validationErrors.routineName[0]}</p>
                )}

                {selectedExercises.length > 0 && (
                    <ul className="w-full flex flex-col gap-2 mt-2 overflow-y-auto max-h-[320px]">
                        {selectedExercises.map((exercise, exerciseIndex) => (
                            <li key={exerciseIndex} id={exercise.id.toString()} className="bg-gray-300 w-full flex flex-col">
                                <div className="exerciseName flex flex-row justify-start items-center gap-3 py-1 px-2 text-[14px]">
                                    <p>{exercise.name}</p>
                                    <TrashIcon onClick={() => handleRemoveExercise(exerciseIndex)} className="w-5 h-5 p-[2px] bg-gray-400 rounded-full  cursor-pointer hover:bg-gray-500"/>
                                </div>
                                {exercise.sets?.length > 0 && (
                                    <ul className="setsList">
                                        {exercise.sets.map((set, setIndex) => (
                                            <li key={setIndex} className="flex flex-row justify-around items-center mb-2 text-[14px]">
                                                <p>Set {setIndex+1}:</p>
                                                <label htmlFor="reps">Reps: </label>
                                                <Input className="w-[40px] py-[0px] pl-[5px]" type="number" min="1" name="reps" id="reps" value={set.reps} onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'reps', Number(e.target.value))} required/>
                                                <label htmlFor="weight">Weight (kg): </label>
                                                <Input className="w-[40px] py-[0px] pl-[5px]" type="number" min="0" name="weight" id="weight" value={set.weight} onChange={(e) => handleSetChange(exerciseIndex, setIndex, 'weight', Number(e.target.value))}/>
                                                <MinusIcon onClick={() => handleRemoveSet(exerciseIndex, setIndex)} className="bg-gray-400 w-4 h-4 rounded-full cursor-pointer hover:bg-red-700" />
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <Button type="button" onClick={() => handleAddSet(exerciseIndex)} className="mt-[0px] mb-1 text-[14px] py-[0px] h-[30px] w-[130px] rounded-[8px]">
                                    <PlusIcon className="w-5"/>
                                    <p>Add Set</p>
                                </Button>
                            </li>
                        ))}
                    </ul>
                )}

                {state?.validationErrors?.routineExercises && (
                    <p className="text-red-500 text-sm mt-2">{state.validationErrors.routineExercises[0]}</p>
                )}

                <Button type="button" onClick={() => setDisplayPopUp(true)} className="justify-center my-2 text-[14px] py-[0px] h-[30px] w-[140px] rounded-[8px] bg-gray-900 hover:bg-gray-500">
                    Add Exercise
                </Button>
                <input type="hidden" name="routine-exercises" value={JSON.stringify(
                    selectedExercises.map((exercise) => ({
                        exerciseId: exercise.id,
                        exerciseName: exercise.name,
                        imageUrl: exercise.imageUrl,
                        sets: exercise.sets
                    }))
                )} />
                {showSuccess && (
                    <p className="text-green-600 text-center mb-4">
                        Routine created successfully!
                    </p>
                )}
                <Button type="submit">Submit</Button>
            </Form> : <PopUp 
                        onClose={() => setDisplayPopUp(false)} 
                        onSelectExercise={(exercise) => {
                            setSelectedExercises((prev) => [...prev, {...exercise, sets: [{setNumber: 1, reps: 0, weight: 0}]}]);
                            setDisplayPopUp(false);
                            }
                        }
            />}
        </>
    )
}