import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { deleteRoutine } from "@/app/lib/deleteRoutine";
import { getRoutineById } from "@/app/lib/getRoutineById";

export async function DELETE(request: Request, { params }: { params: Promise<{ routineId: string }> }) {
  const session = await auth();
  const userId = Number(session?.user.id);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { routineId } = await params;
  const routineIdNum = Number(routineId);
  const deletedWorkout = await deleteRoutine(routineIdNum, userId);
  return NextResponse.json({success: !!deletedWorkout});
};

export async function GET(request: Request, { params }: { params: Promise<{ routineId: string }> }) {
  const session = await auth();
  const userId = Number(session?.user.id);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { routineId } = await params;
  const routineIdNum = Number(routineId);
  const routineToSubmit = await getRoutineById(routineIdNum, userId);
  return NextResponse.json(routineToSubmit);
}