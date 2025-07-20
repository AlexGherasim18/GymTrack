'use client';

import { useEffect, useState } from "react";
import { useExercisesListStore } from "@/app/store/exercisesStore";
import { WorkoutExercise } from "@/app/lib/definitions";
import { WorkoutExerciseDisplay } from "@/app/ui/workout-exercise-display";
import Link from "next/link";
import Button from "@/app/ui/button";

export default function Workouts() {
  const [workouts, setWorkouts] = useState<any[] | undefined>([]);
  const {muscleGroups, fetchExercisesList} = useExercisesListStore();


  useEffect(() => {
    const fetchWorkouts = async () => {
      const res = await fetch("/api/workouts");
      const data = await res.json();
      setWorkouts(data);
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
        <section>
          {workouts?.length && 
            <ul className="w-full max-w-[900px] mx-auto mt-[30px] grid grid-cols-3 gap-3">
              {workouts.map((workout) =>
                <li key={workout.id} className="flex flex-col justify-between shadow-xl px-2 py-3 h-[240px]">
                  <section className="workout-info">  
                    <h3 className="font-semibold mb-1.5 underline">{workout.name}</h3>
                    <p className="text-[14px]">Date: {workout.date.split("T")[0]}</p>
                    {workout.workoutExercises.map((workoutExercise: WorkoutExercise) => (
                      <WorkoutExerciseDisplay 
                        key={workoutExercise.id} 
                        workoutExercise={workoutExercise} 
                        getExerciseById={getExerciseById}/>
                    ))}
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
            </ul>}
        </section>
    )
}