import { RoutineExercise } from "../lib/definitions";

export function RoutineExerciseDisplay(
    {routineExercise, getExerciseById}:
    {routineExercise: RoutineExercise, getExerciseById: (id: number) => any}
) {
    const exercise = getExerciseById(routineExercise.exerciseId);
    if (!exercise) return null;

    const repsArray = routineExercise.sets.map((set) => set.reps);
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
                {routineExercise.sets.length} X {minReps === maxReps ? minReps : `${minReps}-${maxReps}`}
            </p>
        </section>
    )
}