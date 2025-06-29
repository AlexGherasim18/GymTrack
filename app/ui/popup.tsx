'use client';

import { useEffect } from "react";
import { useExercisesListStore } from "../store/exercisesStore";
import { XCircleIcon } from "@heroicons/react/24/outline";
import Button from "./button";

export default function PopUp({onClose, onSelectExercise}: {onClose: () => void; onSelectExercise: (exercise: any) => void}) {
    const {muscleGroups, fetchExercisesList} = useExercisesListStore();

    useEffect(() => {
        fetchExercisesList();
    }, [fetchExercisesList])

    return (
        <section className="fixed top-0 left-0 w-full h-full bg-gray-500/50 flex items-center justify-center">
            <section className="flex flex-col items-center absolute right-50 w-[720px] h-[500px] bg-gray-50 p-10 overflow-y-auto">
                <XCircleIcon onClick={onClose} className="w-8 absolute top-1 left-2 hover:text-red-500 cursor-pointer"/>
                {muscleGroups.map((group) => (
                    <div key={group.id}>
                        <h2 className="font-semibold text-[20px]">{group.name}</h2>
                        <ul className="grid grid-cols-2 gap-3">
                            {group.exercises.map((exercise) => (
                                <li key={exercise.id} className="w-[280px] h-[240px] flex flex-col border-2 border-gray-700 mb-3 rounded-[5px]">
                                    <img className="w-[280px] h-[140px]" src={exercise.imageUrl} alt={exercise.name} />
                                    <div className="flex flex-col justify-between flex-1 p-2">
                                        <p className="text-center text-[14px] leading-snug">{exercise.name}</p>
                                        <Button onClick={() => onSelectExercise(exercise)} className="w-[20px] h-[30px] text-xs justify-center">Add</Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </section>
        </section>
    )
}