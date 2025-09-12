import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { deleteWorkout } from "@/app/lib/deleteWorkout";
import { getWorkoutById } from "@/app/lib/getWorkoutById";

export async function DELETE(request: Request, { params }: { params: Promise<{ workoutId: string }> }) {
  const session = await auth();
  const userId = Number(session?.user.id);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { workoutId } = await params;
  const workoutIdNum = Number(workoutId);
  const deletedWorkout = await deleteWorkout(workoutIdNum, userId);
  return NextResponse.json({success: !!deletedWorkout});
}

export async function GET(request: Request, { params }: { params: Promise<{ workoutId: string }> }) {
  const session = await auth();
  const userId = Number(session?.user.id);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { workoutId } = await params;
  const workoutIdNum = Number(workoutId);
  const workoutToEdit = await getWorkoutById(workoutIdNum, userId);
  return NextResponse.json(workoutToEdit);
}