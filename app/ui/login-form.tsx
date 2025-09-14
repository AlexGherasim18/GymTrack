'use client'

import { KeyIcon, UserIcon, ArrowRightIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Button from "./button";
import Form from "./form";
import Input from "./input";
import { authenticate } from "../lib/actions";
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LoginForm() {
    const router = useRouter();
    const { data: session} = useSession();
    const [state, formAction, isPending] = useActionState(authenticate, undefined);

    useEffect(() => {
        if (state?.success && session) {
            if (session.user.role === 'admin') {
                router.replace('/admin/dashboard');
            } else {
                router.replace('/user/dashboard');
            }
        }
    }, [state?.success, session?.user?.role, router]);

    return (
        <Form action={formAction} className="w-full shadow-xl">
            <h1 className="text-xl font-medium mb-10 text-blue-700">Please log in to continue.</h1>

            <section className="w-full flex flex-col items-start gap-4">
                <label className="text-sm" htmlFor="username">Username:</label>
                <div className="w-full relative">
                    <Input className="peer w-full" type="text" name="username" id="username" placeholder="Enter username" autoComplete="username" required/>
                    <UserIcon className="w-5 absolute pointer-events-none left-3 top-1/2 h-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                </div>

                <label className="text-sm" htmlFor="password">Password</label>
                <div className="w-full relative">
                    <Input className="peer w-full" type="password" name="password" id="password" placeholder="Enter password" required/>
                    <KeyIcon className="w-5 absolute pointer-events-none left-3 top-1/2 h-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                </div>
            </section>
            <Button className="mt-8">Log in <ArrowRightIcon className="w-5" aria-disabled={isPending}/></Button>
            <div className="flex h-8 items-end space-x-1">
            {state?.error && (
                <>
                    <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                    <p className="text-sm text-red-500">{state.error}</p>
                </>
            )}
        </div>
        </Form>
    )
}