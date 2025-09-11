'use client';

import EditWorkoutForm from "@/app/ui/edit-workout-form";
import { Suspense } from "react";
import SkeletonLoading from "@/app/ui/skeleton-loading";

export default function EditWorkout() {

    return (
        <Suspense fallback={<SkeletonLoading/>}>
            <EditWorkoutForm />
        </Suspense>
    )
}