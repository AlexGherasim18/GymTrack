'use client';

import SubmitRoutineForm from "@/app/ui/submit-routine-form";
import { Suspense } from "react";
import SkeletonLoading from "@/app/ui/skeleton-loading";

export default function SubmitRoutine() {

    return (
        <Suspense fallback={<SkeletonLoading/>}>
            <SubmitRoutineForm />
        </Suspense>
    )
}