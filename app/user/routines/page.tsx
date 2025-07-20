'use client';

import { useState, useEffect } from "react";
import { useExercisesListStore } from "@/app/store/exercisesStore";
import Link from "next/link";
import Button from "@/app/ui/button";
import { RoutineExercise } from "@/app/lib/definitions";
import { RoutineExerciseDisplay } from "@/app/ui/routine-exercise-display";

export default function Routines() {
    const [routines, setRoutines] = useState<any[] | undefined>([]);
    const {muscleGroups, fetchExercisesList} = useExercisesListStore();

    useEffect(() => {
        const fetchRoutines = async () => {
            const res = await fetch("/api/routines");
            const data = await res.json();
            setRoutines(data);
            console.log("Routines", data);
        }
        fetchRoutines();
        fetchExercisesList();
    }, [fetchExercisesList]);

    const allExercises = muscleGroups.flatMap((muscleGroup) => muscleGroup.exercises);
    const getExerciseById = (id: number) => allExercises.find((exercise) => exercise.id === id);

    const handleDelete = async (routineId: number) => {
        await fetch(`/api/routines/${routineId}`, {method: "DELETE"})
        setRoutines((routines) => routines?.filter((routine) => routine.id !== routineId))
    }

    return (
        <section>
          {routines?.length && 
            <ul className="w-full max-w-[900px] mx-auto mt-[30px] grid grid-cols-3 gap-3">
              {routines.map((routine) =>
                <li key={routine.id} className="flex flex-col justify-between shadow-xl px-2 py-3 h-[240px]">
                  <section className="workout-info">  
                    <h3 className="font-semibold mb-1.5 underline">{routine.name}</h3>
                    {routine.routineExercises.map((routineExercise: RoutineExercise) => (
                      <RoutineExerciseDisplay 
                        key={routineExercise.id} 
                        routineExercise={routineExercise}
                        getExerciseById={getExerciseById}/>
                    ))}
                  </section>
                  <section className="workout-action-buttons flex flex-row justify-between">
                    <Link 
                      href={`routines/${routine.id}`} 
                      className="inline-flex w-[54px] h-[25px] items-center justify-center bg-blue-500 hover:bg-blue-900 cursor-pointer text-amber-50 text-[14px] rounded-2xl px-2.5 py-1.5">
                      Start
                    </Link>
                    <Button 
                      unstyled 
                      className="inline-flex w-[54px] h-[25px] items-center justify-center bg-gray-400 cursor-pointer hover:bg-gray-500 text-[14px] rounded-2xl px-2.5 py-1.5"
                      onClick={() => handleDelete(routine.id)}>
                      Delete
                    </Button>
                  </section>
                </li> 
              )}
            </ul>}
        </section>
    )
}