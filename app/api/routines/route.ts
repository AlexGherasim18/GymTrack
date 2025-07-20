import { NextResponse } from "next/server";
import { getUserRoutines } from "@/app/lib/getUserRoutines";
import { auth } from "@/app/lib/auth";

export async function GET() {
    const session = await auth();
    const userId = Number(session?.user.id);
    if(!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const routines = await getUserRoutines(userId);
    return NextResponse.json(routines);
}