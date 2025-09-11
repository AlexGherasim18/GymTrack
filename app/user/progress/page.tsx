import AllCharts from "@/app/ui/all-charts";
import { Suspense } from "react";
import SkeletonLoading from "@/app/ui/skeleton-loading";

export default function Progress() {
    return (
        <Suspense fallback={<SkeletonLoading />}>
            <AllCharts />
        </Suspense>
    )
}