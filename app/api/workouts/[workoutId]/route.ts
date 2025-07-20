import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { deleteWorkout } from "@/app/lib/deleteWorkout";
import { getWorkoutById } from "@/app/lib/getWorkoutById";

export async function DELETE(request: Request, { params }: { params: { workoutId: string } }) {
  const session = await auth();
  const userId = Number(session?.user.id);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const workoutId = Number(params.workoutId);
  const deletedWorkout = await deleteWorkout(workoutId, userId);
  return NextResponse.json({success: !!deleteWorkout});
}

export async function GET(request: Request, context: Promise<{params: {workoutId: string}}>) {
  const session = await auth();
  const { params } = await context;
  const userId = Number(session?.user.id);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const workoutId = Number(params.workoutId);
  const workoutToEdit = await getWorkoutById(workoutId, userId);
  return NextResponse.json(workoutToEdit);
}