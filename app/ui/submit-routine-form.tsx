'use client';

import { useParams } from "next/navigation";
import { useState, useEffect, useActionState } from "react";
import { RoutineToSubmit } from "../lib/definitions";
import Form from "./form";
import Input from "./input";
import Button from "./button";
import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { addWorkout } from "../lib/actions";
import SkeletonLoading from "./skeleton-loading";

export default function SubmitRoutineForm() {
    const { routineId } = useParams();
    const today = new Date();

    const initialState = {
        id: 0,
        name: "",
        date: "",
        routineExercises: []
    }

    const [ routineToSubmit, setRoutineToSubmit ] = useState<RoutineToSubmit>(initialState);
    const [date, setDate] = useState(today.toISOString().split('T')[0]);
    const { routineExercises } = routineToSubmit;
    const [isDataReady, setIsDataReady] = useState(false);

    const [state, formAction] = useActionState(addWorkout, undefined);

    useEffect(() => {
        const fetchRoutine = async () => {
            try {
                const res = await fetch(`/api/routines/${routineId}`);
                const data = await res.json();
                setRoutineToSubmit(data);
                setIsDataReady(true);
            } catch(error) {
                console.log(error)
            }
    };
        fetchRoutine();
    }, [routineId])

    const handleRemoveExercise = (exerciseToRemoveIndex: number) => {
        setRoutineToSubmit(routine => 
            routine
                ? {
                    ...routine,
                    routineExercises: [
                        ...routine.routineExercises.slice(0, exerciseToRemoveIndex),
                        ...routine.routineExercises.slice(exerciseToRemoveIndex + 1)
                    ]
                } : routine
        );
    };

    const handleSetChange = (
        routineExerciseIndex: number,
        setIndex: number,
        field: 'reps' | 'weight',
        value: number
    ) => {
        setRoutineToSubmit(routine =>
            routine
                ? {
                    ...routine,
                    routineExercises: routine.routineExercises.map((routineExercise, index) =>
                        index === routineExerciseIndex
                            ? {
                                ...routineExercise,
                                sets: routineExercise.sets.map((set, index) =>
                                    index === setIndex
                                        ? { ...set, [field]: value }
                                        : set
                                )
                            }
                            : routineExercise
                    )
                }
                : routine
        );
    };

    const handleRemoveSet = (routineExerciseIndex: number, setIndex: number) => {
        setRoutineToSubmit((routine) => 
            routine 
                ? {
                    ...routine,
                    routineExercises: routine.routineExercises.map((routineExercise, index) => 
                        index === routineExerciseIndex
                            ? {
                                ...routineExercise,
                                sets: routineExercise.sets.filter((_, index) => index !== setIndex)
                            }
                            : routineExercise
                    )
                }
                : routine
        );
    };

    const handleAddSet = (routineExerciseIndex: number) => {
        setRoutineToSubmit((routine) => 
            routine
                ? {
                    ...routine,
                    routineExercises: routine.routineExercises.map((routineExercise, index) => 
                        index === routineExerciseIndex
                            ? {
                                ...routineExercise,
                                sets: [
                                    ...routineExercise.sets,
                                    {
                                        id: 0, // temporary, not a real DB id
                                        setNumber: routineExercise.sets.length + 1,
                                        reps: 0,
                                        weight: 0,
                                        routineExerciseId: routineExercise.id
                                    }
                                ]
                            } : routineExercise
                    )
                } : routine
        );
    };

    return (
        <>
            {
                isDataReady 
                    ?
                        (
                            <Form action={formAction} className="max-w-[400px] mx-auto mt-10 max-h-screen overflow-hidden">
                                <label htmlFor="workout-name" 
                                    className="
                                        max-[657px]:text-[14px]">
                                            Routine Name:
                                </label>
                                <Input className="w-full" type="text" name="workout-name" id="workout-name" value={routineToSubmit?.name ?? ""} readOnly/>

                                <label htmlFor="workout-date" 
                                    className="
                                        max-[657px]:text-[14px]">
                                            Routine Date:
                                </label>
                                <Input className="w-full" type="date" name="workout-date" id="workout-date" value={date} max={date} onChange={(e) => setDate(e.target.value)} required/>

                                <input type="hidden" name="workout-id" value={routineToSubmit.id} />

                                {routineToSubmit?.routineExercises?.length > 0 && (
                                    <ul className="w-full flex flex-col gap-2 mt-2 overflow-y-auto max-h-[320px]">
                                        {routineToSubmit.routineExercises.map((routineExercise, routineExerciseIndex) => (
                                            <li key={routineExerciseIndex} id={routineExercise.id.toString()} className="bg-gray-300 w-full flex flex-col">
                                                <div className="exerciseName flex flex-row justify-start items-center gap-3 py-1 px-2 text-[14px]">
                                                    <p className="max-[315px]:text-[12px]">{routineExercise.exercise?.name}</p>
                                                    <TrashIcon onClick={() => handleRemoveExercise(routineExerciseIndex)} 
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
                                                {routineExercise.sets?.length && (
                                                    <ul className="setsList">
                                                        {routineExercise.sets.map((set, setIndex) => (
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
                                                                    <Input className="no-spinner w-[40px] py-[0px] pl-[5px] max-[315px]:w-[25px] max-[315px]:pl-[3px]" type="number" min="1" name="reps" id="reps" value={set.reps === 0 ? "" : set.reps} onFocus={e => {
                                                                        if(e.target.value === "0") {
                                                                            e.target.value = ""
                                                                        }
                                                                    }} onChange={(e) => handleSetChange(routineExerciseIndex, setIndex, 'reps', Number(e.target.value))} required/>
                                                                    <label htmlFor="weight">Weight (kg): </label>
                                                                    <Input className="no-spinner w-[40px] py-[0px] pl-[5px] max-[315px]:w-[25px]" type="number" min="0" name="weight" id="weight" value={set.weight === 0 ? "" : set.weight} onFocus={e => {
                                                                        if(e.target.value === "0") {
                                                                            e.target.value = ""
                                                                        }
                                                                    }} onChange={(e) => handleSetChange(routineExerciseIndex, setIndex, 'weight', Number(e.target.value))}/>
                                                                    <MinusIcon onClick={() => handleRemoveSet(routineExerciseIndex, setIndex)} 
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
                                                <Button type="button" onClick={() => handleAddSet(routineExerciseIndex)} 
                                                    className="
                                                        mt-[0px] 
                                                        mb-1 
                                                        text-[14px] 
                                                        py-[0px] 
                                                        h-[30px] 
                                                        w-[130px] 
                                                        rounded-[8px]
                                                        
                                                        max-[315px]:w-[40px]>
                                                        max-[315px]:text-[12px]">
                                                    <PlusIcon className="w-5 max-[315px]:w-3"/>
                                                    <p>Add Set</p>
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <input type="hidden" name="workoutExercises" value={JSON.stringify(
                                    routineExercises.map((routineExercise) => ({
                                        exerciseId: routineExercise.exerciseId,
                                        exerciseName: routineExercise.exercise.name,
                                        imageUrl: routineExercise.exercise.imageUrl,
                                        sets: routineExercise.sets
                                    }))
                                )} />
                                <Button type="submit">Submit</Button>
                            </Form>
                        )
                    :
                        (
                            <section className="w-full max-w-[540px] col-span-2 mx-auto px-2 flex flex-col items-center h-64"><SkeletonLoading/></section>
                        )
            }
        </>
    )
}