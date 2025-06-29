import { getExercises } from "@/app/lib/getExercises";
import { NextResponse } from "next/server";

export async function GET() {
    const exercisesList = await getExercises();
    return NextResponse.json(exercisesList);
}