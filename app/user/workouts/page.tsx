'use client';

import { useEffect, useState } from "react";
import { useExercisesListStore } from "@/app/store/exercisesStore";
import { WorkoutExercise } from "@/app/lib/definitions";
import { WorkoutExerciseDisplay } from "@/app/ui/workout-exercise-display";
import Link from "next/link";
import Button from "@/app/ui/button";
import { Suspense } from "react";
import SkeletonLoading from "@/app/ui/skeleton-loading";

export default function Workouts() {
  const [workouts, setWorkouts] = useState<any[] | undefined>([]);
  const {muscleGroups, fetchExercisesList} = useExercisesListStore();
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await fetch("/api/workouts");
        const data = await res.json();
        setWorkouts(data);
        setIsDataReady(true);
      } catch(error) {
        console.log(error)
      }
    };
    fetchWorkouts();
    fetchExercisesList();
  }, [fetchExercisesList]);
  const allExercises = muscleGroups.flatMap((muscleGroup) => muscleGroup.exercises);
  const getExerciseById = (id: number) => allExercises.find((exercise) => exercise.id === id);

  const handleDelete = async (workoutId: number) => {
    await fetch(`/api/workouts/${workoutId}`, {method: "DELETE"})
    setWorkouts((workouts) => workouts?.filter((workout) => workout.id !== workoutId))
  }

    return (
      <Suspense fallback={<SkeletonLoading/>}>
        <section className="max-h-[calc(100vh-2rem)] overflow-y-auto overflow-x-hidden">
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
              {workouts?.map((workout) =>
                <li key={workout.id} 
                  className="
                    flex 
                    flex-col 
                    justify-between 
                    shadow-xl 
                    px-2 
                    py-3 
                    h-[300px]
                    w-full
                    max-w-[280px]
                    
                    max-[474px]:mx-auto
                    max-[235px]:h-[300px]">
                  <section className="workout-info mb-2">  
                    <h3 className="font-semibold mb-1.5 underline">{workout.name}</h3>
                    <p className="text-[14px]">Date: {workout.date.split("T")[0]}</p>
                    <div className="exercises-list-container max-h-[180px] overflow-hidden overflow-y-auto">
                      {workout.workoutExercises.map((workoutExercise: WorkoutExercise) => (
                        <WorkoutExerciseDisplay 
                          key={workoutExercise.id} 
                          workoutExercise={workoutExercise} 
                          getExerciseById={getExerciseById}/>
                      ))}
                    </div>
                  </section>
                  <section className="workout-action-buttons flex flex-row justify-between">
                    <Link 
                      href={`workouts/${workout.id}`} 
                      className="inline-flex w-[54px] h-[25px] items-center justify-center bg-blue-500 hover:bg-blue-900 cursor-pointer text-amber-50 text-[14px] rounded-2xl px-2.5 py-1.5">
                      Edit
                    </Link>
                    <Button 
                      unstyled 
                      className="inline-flex w-[54px] h-[25px] items-center justify-center bg-gray-400 cursor-pointer hover:bg-gray-500 text-[14px] rounded-2xl px-2.5 py-1.5"
                      onClick={() => handleDelete(workout.id)}>
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