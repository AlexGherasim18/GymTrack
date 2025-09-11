'use client'

import Link from "next/link";
import Button from "./button";
import { logout } from "../lib/actions";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import HamburgerButton from "./hamburger-button";

export default function SideNav() {
    const {data: session, status} = useSession();
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const username = session?.user.name;
    const role = session?.user.role;

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleLinkClick = () => {
        if (window.innerWidth <= 670) {
            closeMenu();
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 670) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <HamburgerButton isOpen={isMenuOpen} onClick={toggleMenu} />
            <nav 
                className={`
                    relative
                    mr-2
                    w-[180px]
                    max-[832px]:w-[140px]
                    min-w-[80px]
                    flex flex-col
                    bg-gray-900
                    text-amber-50
                    text-[14px]

                    max-[815px]:text-[12px]

                    max-[670px]:fixed 
                    max-[670px]:top-0 
                    max-[670px]:left-0 
                    max-[670px]:h-full 
                    max-[670px]:w-[220px] 
                    max-[670px]:z-50
                    max-[670px]:transition-transform 
                    max-[670px]:duration-300

                    ${isMenuOpen ? 'max-[670px]:translate-x-0' : 'max-[670px]:-translate-x-full'}
                `}
            >
                {isMenuOpen && (
                    <button
                        className="
                            absolute top-2 right-4
                            max-[670px]: block
                            min-[671px]:hidden
                            text-amber-50
                            text-2xl
                            z-50
                            focus:outline-none
                            cursor-pointer
                        "
                        aria-label="Close menu"
                        onClick={closeMenu}
                    >
                        &times;
                    </button>
                )}
                <Link href="/user/dashboard" className="flex h-30 flex-col justify-center items-center rounded-sm">
                    <h1 
                        className="
                            font-semibold 
                            text-xl 
                            tracking-widest
                            max-[700px]: text-[16px]"
                    >
                        {username}
                    </h1>
                    <h1 
                        className="
                            font-medium 
                            text-sm 
                            tracking-widest
                            max-[700px]: text-[12px]"
                    >
                        {role}
                    </h1>
                </Link>
                <ul className="flex flex-1/2 flex-col justify-start items-center w-full">
                    <Link href="/user/dashboard" className={`flex w-full items-center px-2 sm:px-4 py-2 rounded-md ${isActive("/user/dashboard") ? "bg-gray-500" : "bg-inherit"} font-medium hover:bg-gray-500`}>
                        <li className="w-full">Home</li>
                    </Link>
                    <Link href="/user/workouts" className={`flex w-full items-center px-2 sm:px-4 py-2 rounded-md ${isActive("/user/workouts") ? "bg-gray-500" : "bg-inherit"} font-medium mt-2 hover:bg-gray-500`}>
                        <li className="w-full">My Workouts</li>
                    </Link>
                    <Link href="/user/routines" className={`flex w-full items-center px-2 sm:px-4 py-2 rounded-md ${isActive("/user/routines") ? "bg-gray-500" : "bg-inherit"} font-medium mt-2 hover:bg-gray-500`}>
                        <li className="w-full">Routines</li>
                    </Link>
                    <Link href="/user/progress" className={`flex w-full items-center px-2 sm:px-4 py-2 rounded-md ${isActive("/user/progress") ? "bg-gray-500" : "bg-inherit"} font-medium mt-2 hover:bg-gray-500`}>
                        <li className="w-full">Progress</li>
                    </Link>
                </ul>
                <form action={logout} className="flex flex-row justify-center mt-2 py-2">
                    <Button type="submit">Sign Out</Button>
                </form>
            </nav>
        </>
    )
}