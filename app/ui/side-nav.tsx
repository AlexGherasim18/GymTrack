'use client'

import Link from "next/link";
import Button from "./button";
import { logout } from "../lib/actions";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function SideNav() {
    const {data: session, status} = useSession();
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href

    const username = session?.user.name;
    const role = session?.user.role;

    return (
        <nav className="mr-2 w-[140px] sm:w-[200px] text-xs sm:text-sm flex flex-col bg-gray-900 text-amber-50">
            <Link href="/user/dashboard" className="flex h-30 flex-col justify-center items-center rounded-sm">
                <h1 className="font-semibold text-xl tracking-widest">{username}</h1>
                <h1 className="font-medium text-sm tracking-widest">{role}</h1>
            </Link>
            <ul className="flex flex-1/2 flex-col justify-start items-center">
                <Link href="/user/dashboard" className={`flex w-26 sm:w-42 items-center px-2 sm:px-4 py-2 rounded-md ${isActive("/user/dashboard") ? "bg-gray-500" : "bg-inherit"} font-medium hover:bg-gray-500`}>
                    <li>Home</li>
                </Link>
                <Link href="/user/workouts" className={`flex w-26 sm:w-42 items-center px-2 sm:px-4 py-2 rounded-md ${isActive("/user/workouts") ? "bg-gray-500" : "bg-inherit"} font-medium mt-2 hover:bg-gray-500`}>
                    <li>My Workouts</li>
                </Link>
                <Link href="/user/routines" className={`flex w-26 sm:w-42 items-center px-2 sm:px-4 py-2 rounded-md ${isActive("/user/routines") ? "bg-gray-500" : "bg-inherit"} font-medium mt-2 hover:bg-gray-500`}>
                    <li>Routines</li>
                </Link>
                <Link href="/user/progress" className={`flex w-26 sm:w-42 items-center px-2 sm:px-4 py-2 rounded-md ${isActive("/user/progress") ? "bg-gray-500" : "bg-inherit"} font-medium mt-2 hover:bg-gray-500`}>
                    <li>Progress</li>
                </Link>
            </ul>
            <form action={logout} className="flex flex-row justify-center mt-2 py-2">
                <Button type="submit">Sign Out</Button>
            </form>
        </nav>
    )
}