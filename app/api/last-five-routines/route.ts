import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { getLastFiveUserRoutines } from "@/app/lib/getLastFiveRoutines";

export async function GET() {
    const session = await auth();
    const userId = Number(session?.user.id);

    if(!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const lastFiveRoutines = await getLastFiveUserRoutines(userId);
    return NextResponse.json(lastFiveRoutines);
}