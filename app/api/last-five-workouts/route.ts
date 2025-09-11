import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { getLastFiveUserWorkouts } from "@/app/lib/getLastFiveWorkouts";

export async function GET() {
    const session = await auth();
    const userId = Number(session?.user.id);

    if(!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const lastFiveWorkouts = await getLastFiveUserWorkouts(userId);
    return NextResponse.json(lastFiveWorkouts);
}