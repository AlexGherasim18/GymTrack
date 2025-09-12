import { WorkoutExercise, Exercise } from "../lib/definitions";

export function WorkoutExerciseDisplay(
    {workoutExercise, getExerciseById}:
    {workoutExercise: WorkoutExercise, getExerciseById: (id: number) => Exercise | undefined}
) {
    const exercise = getExerciseById(workoutExercise.exerciseId);
    if (!exercise) return null;

    const repsArray = workoutExercise.sets.map((set) => set.reps);
    const minReps = Math.min(...repsArray);
    const maxReps = Math.max(...repsArray);

    return (
        <section 
            className="
                exercise-and-sets 
                text-[14px] 
                flex 
                flex-col 
                justify-between
                border-b-[1px]
                border-gray-300
                "
        >
            <p>{exercise.name}</p>
            <p>
                {workoutExercise.sets.length} X {minReps === maxReps ? minReps : `${minReps}-${maxReps}`}
            </p>
        </section>
    )
}
