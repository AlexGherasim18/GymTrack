'use client'

import { useEffect, useState, useActionState } from "react";
import { useParams } from "next/navigation";
import Form from "./form";
import Input from "./input";
import Button from "./button";
import { WorkoutToEdit } from "../lib/definitions";
import { TrashIcon, MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import PopUp from "./popup";
import { updateWorkout } from "../lib/actions";
import SkeletonLoading from "./skeleton-loading";

export default function EditWorkoutForm() {
    const { workoutId } = useParams();

    const initialStateWorkout = {
        id: 0,
        name: "",
        date: "",
        workoutExercises: []
    }
    const [workoutToEdit, setWorkoutToEdit] = useState<WorkoutToEdit>(initialStateWorkout);
    const { workoutExercises } = workoutToEdit;
    const [displayPopUp, setDisplayPopUp] = useState(false);
    const [state, formAction] = useActionState(updateWorkout, undefined);
    const [isDataReady, setIsDataReady] = useState(false);

    useEffect(() => {
        const fetchWorkout = async () => {
            try {
                const res = await fetch(`/api/workouts/${workoutId}`);
                const data = await res.json();
                setWorkoutToEdit(data);
                setIsDataReady(true);
            } catch(error) {
                console.log(error)
            }
    };
        fetchWorkout();
    }, [workoutId])

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWorkoutToEdit(workout => workout ? {...workout, name: e.target.value} : workout);
    }
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setWorkoutToEdit(workout => workout ? {...workout, date: e.target.value} : workout)
    }
    
    const handleRemoveExercise = (exerciseToRemoveIndex: number) => {
        setWorkoutToEdit(workout => 
            workout
                ? {
                    ...workout,
                    workoutExercises: [
                        ...workout.workoutExercises.slice(0, exerciseToRemoveIndex),
                        ...workout.workoutExercises.slice(exerciseToRemoveIndex + 1)
                    ]
                } : workout
        );
    };

    const handleSetChange = (
        workoutExerciseIndex: number,
        setIndex: number,
        field: 'reps' | 'weight',
        value: number
    ) => {
        setWorkoutToEdit(workout =>
            workout
                ? {
                    ...workout,
                    workoutExercises: workout.workoutExercises.map((workoutExercise, index) =>
                        index === workoutExerciseIndex
                            ? {
                                ...workoutExercise,
                                sets: workoutExercise.sets.map((set, index) =>
                                    index === setIndex
                                        ? { ...set, [field]: value }
                                        : set
                                )
                            }
                            : workoutExercise
                    )
                }
                : workout
        );
    };

    const handleRemoveSet = (workoutExerciseIndex: number, setIndex: number) => {
        setWorkoutToEdit((workout) => 
            workout 
                ? {
                    ...workout,
                    workoutExercises: workout.workoutExercises.map((workoutExercise, index) => 
                        index === workoutExerciseIndex
                            ? {
                                ...workoutExercise,
                                sets: workoutExercise.sets.filter((_, index) => index !== setIndex)
                            }
                            : workoutExercise
                    )
                }
                : workout
        );
    };

    const handleAddSet = ((workoutExerciseIndex: number) => {
        setWorkoutToEdit((workout) => 
            workout
                ? {
                    ...workout,
                    workoutExercises: workout.workoutExercises.map((workoutExercise, index) => 
                        index === workoutExerciseIndex
                            ? {
                                ...workoutExercise,
                                sets: [
                                    ...workoutExercise.sets,
                                    {
                                        id: 0, // temporary, not a real DB id
                                        setNumber: workoutExercise.sets.length + 1,
                                        reps: 0,
                                        weight: 0,
                                        workoutExerciseId: workoutExercise.id
                                    }
                                ]
                            } : workoutExercise
                    )
                } : workout
        );
    })

    return (
        <>
            {
                isDataReady 
                    ? 
                        (
                            !displayPopUp 
                                ?
                                    (<Form action={formAction} className="max-w-[400px] mx-auto mt-10 max-h-screen overflow-hidden">
                                        <label htmlFor="workout-name"
                                            className="
                                                max-[657px]:text-[14px]">
                                                    Workout Name:
                                        </label>
                                        <Input className="w-full" type="text" name="workout-name" id="workout-name" value={workoutToEdit?.name ?? ""} onChange={handleNameChange} required/>
                
                                        <label htmlFor="workout-date"
                                            className="
                                                max-[657px]:text-[14px]">
                                                    Workout Date:
                                        </label>
                                        <Input className="w-full" type="date" name="workout-date" id="workout-date" value={workoutToEdit?.date.split("T")[0] ?? ""} onChange={handleDateChange} required/>
                
                                        <input type="hidden" name="workout-id" value={workoutToEdit.id} />
                
                                        {workoutToEdit?.workoutExercises?.length > 0 && (
                                            <ul className="w-full flex flex-col gap-2 mt-2 overflow-y-auto max-h-[320px]">
                                                {workoutToEdit.workoutExercises.map((workoutExercise, workoutExerciseIndex) => (
                                                    <li key={workoutExerciseIndex} id={workoutExercise.id.toString()} className="bg-gray-300 w-full flex flex-col">
                                                        <div className="exerciseName flex flex-row justify-start items-center gap-3 py-1 px-2 text-[14px]">
                                                            <p className="max-[315px]:text-[12px]">{workoutExercise.exercise?.name}</p>
                                                            <TrashIcon onClick={() => handleRemoveExercise(workoutExerciseIndex)} 
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
                                                        {workoutExercise.sets?.length && (
                                                            <ul className="setsList">
                                                                {workoutExercise.sets.map((set, setIndex) => (
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
                                                                            <Input className="no-spinner w-[40px] py-[0px] pl-[5px]  max-[315px]:w-[25px] max-[315px]:pl-[3px]" type="number" min="1" name="reps" id="reps" value={set.reps === 0 ? "" : set.reps} onFocus={e => {
                                                                                if(e.target.value === "0") {
                                                                                    e.target.value = ""
                                                                                }
                                                                            }} onChange={(e) => handleSetChange(workoutExerciseIndex, setIndex, 'reps', Number(e.target.value))} required/>
                                                                            <label htmlFor="weight">Weight (kg): </label>
                                                                            <Input className="no-spinner w-[40px] py-[0px] pl-[5px]" type="number" min="0" name="weight" id="weight" value={set.weight === 0 ? "" : set.weight} onFocus={e => {
                                                                                if(e.target.value === "0") {
                                                                                    e.target.value = ""
                                                                                }
                                                                            }} onChange={(e) => handleSetChange(workoutExerciseIndex, setIndex, 'weight', Number(e.target.value))}/>
                                                                            <MinusIcon onClick={() => handleRemoveSet(workoutExerciseIndex, setIndex)} className="
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
                                                        <Button type="button" onClick={() => handleAddSet(workoutExerciseIndex)} 
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
                                        <Button type="button" onClick={() => setDisplayPopUp(true)} className="justify-center my-2 text-[14px] py-[0px] h-[30px] w-[140px] rounded-[8px] bg-gray-900 hover:bg-gray-500">
                                            Add Exercise
                                        </Button>
                                        <input type="hidden" name="workoutExercises" value={JSON.stringify(
                                            workoutExercises.map((workoutExercise) => ({
                                                id: workoutExercise.id,
                                                exerciseId: workoutExercise.exerciseId,
                                                workoutId: workoutExercise.workoutId,
                                                exerciseName: workoutExercise.exercise.name,
                                                imageUrl: workoutExercise.exercise.imageUrl,
                                                sets: workoutExercise.sets
                                            }))
                                        )} />
                                        <Button type="submit">Submit</Button>
                                    </Form>)
                                : 
                                    (<PopUp 
                                        onClose={() => setDisplayPopUp(false)} 
                                        onSelectExercise={(exercise) => {
                                            setWorkoutToEdit((workout) => 
                                                workout
                                                    ? {
                                                        ...workout,
                                                        workoutExercises: [
                                                            ...workout.workoutExercises,
                                                            {
                                                                id: 0, 
                                                                exerciseId: exercise.id,
                                                                workoutId: workout.id,
                                                                sets:[
                                                                    {
                                                                        id: 0,
                                                                        setNumber: 1, 
                                                                        reps: 0, 
                                                                        weight: 0,
                                                                        workoutExerciseId: 0
                                                                    }
                                                                ],
                                                                exercise: {
                                                                    id: exercise.id,
                                                                    name: exercise.name,
                                                                    description: exercise.description,
                                                                    imageUrl: exercise.imageUrl
                                                                }
                                                            }
                                                        ]
                                                    } : workout
                                                );
                                            setDisplayPopUp(false);
                                            }
                                        }
                                    />)
                        )
                    : 
                        (
                            <section className="w-full max-w-[540px] col-span-2 mx-auto px-2 flex flex-col items-center h-64"><SkeletonLoading/></section>
                        )
            }
        </>
    )
}