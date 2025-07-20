import { NextResponse } from "next/server";
import { getUserWorkouts } from "@/app/lib/getUserWorkouts";
import { auth } from "@/app/lib/auth";

export async function GET() {
  const session = await auth();
  const userId = Number(session?.user.id);
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const workouts = await getUserWorkouts(userId);
  return NextResponse.json(workouts);
};