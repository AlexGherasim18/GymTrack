'use client';

import { useState, useEffect } from "react";
import { useExercisesListStore } from "@/app/store/exercisesStore";
import Link from "next/link";
import Button from "@/app/ui/button";
import { Routine, RoutineExercise } from "@/app/lib/definitions";
import { RoutineExerciseDisplay } from "@/app/ui/routine-exercise-display";
import { Suspense } from "react";
import SkeletonLoading from "@/app/ui/skeleton-loading";

export default function Routines() {
    const [routines, setRoutines] = useState<Routine[] | undefined>([]);
    const {muscleGroups, fetchExercisesList} = useExercisesListStore();
    const [isDataReady, setIsDataReady] = useState(false);

    useEffect(() => {
        const fetchRoutines = async () => {
          try {
            const res = await fetch("/api/routines");
            const data = await res.json();
            setRoutines(data);
            setIsDataReady(true);
          } catch(error) {
            console.log(error)
          }
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
      <Suspense fallback={<SkeletonLoading/>}>
        <section>
          {isDataReady ? 
            (<ul 
              className="
                w-full 
                max-w-[900px] 
                mx-auto 
                mt-[30px] 
                grid 
                grid-cols-3 
                gap-3

                max-[716px]:grid-cols-2
                            px-2
                
                max-[474px]:flex
                            flex-col
                            pb-4">
              {routines?.map((routine) =>
                <li key={routine.id} 
                  className="
                    flex 
                    flex-col 
                    justify-between 
                    shadow-xl 
                    px-2 
                    py-3 
                    h-[270px]
                    w-full
                    max-w-[280px]
                    
                    max-[474px]:mx-auto
                    max-[235px]:h-[300px]">
                  <section className="workout-info mb-2">  
                    <h3 className="font-semibold mb-1.5 underline">{routine.name}</h3>
                    <div className="exercises-list-container max-h-[180px] overflow-hidden overflow-y-auto">
                      {routine.routineExercises.map((routineExercise: RoutineExercise) => (
                        <RoutineExerciseDisplay 
                          key={routineExercise.id} 
                          routineExercise={routineExercise}
                          getExerciseById={getExerciseById}
                        />
                      ))}
                    </div>
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
            </ul>) : (<section className="w-full max-w-[540px] col-span-2 mx-auto px-2 flex flex-col items-center h-64"><SkeletonLoading/></section>)}
        </section>
      </Suspense>
    )
}