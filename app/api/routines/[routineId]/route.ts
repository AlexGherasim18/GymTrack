import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { deleteRoutine } from "@/app/lib/deleteRoutine";
import { getRoutineById } from "@/app/lib/getRoutineById";

export async function DELETE(request: Request, { params }: { params: { routineId: string } }) {
  const session = await auth();
  const userId = Number(session?.user.id);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const routineId = Number(params.routineId);
  const deletedWorkout = await deleteRoutine(routineId, userId);
  return NextResponse.json({success: !!deleteRoutine});
};

export async function GET(request: Request, { params }: { params: { routineId: string } }) {
  const session = await auth();
  const userId = Number(session?.user.id);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const routineId = Number(params.routineId);
  const routineToSubmit = await getRoutineById(routineId, userId);
  return NextResponse.json(routineToSubmit);
}