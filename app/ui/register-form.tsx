'use client'

import { KeyIcon, UserIcon, AtSymbolIcon, ArrowRightIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import Button from "./button";
import Form from "./form";
import Input from "./input";
import { useActionState, useEffect, useState } from "react";
import { register } from "../lib/actions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [state, formAction, isPending] = useActionState(register, undefined);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if(state?.success) {
            setShowSuccess(true);
            const timeout = setTimeout(() => {
                router.replace('/login');
            }, 1000);
            return () => clearTimeout(timeout);
        }
    }, [state, router]);

    useEffect(() => {
        if (status === 'authenticated') {
            if (session.user.role === 'admin') {
                router.replace('/admin/dashboard');
            } else {
                router.replace('/user/dashboard');
            }
        }
    }, [session, status, router]);

    return (
        <Form action={formAction} className="w-full shadow-xl">
            <h1 className="text-xl font-medium mb-10 text-blue-700">Create an account.</h1>

            <section className="w-full flex flex-col items-start gap-4">
                <label className="text-sm" htmlFor="username">Username:</label>
                <div className="w-full relative">
                    <Input className="peer w-full" type="text" name="username" id="username" placeholder="Enter username" autoComplete="username" required/>
                    <UserIcon className="w-5 absolute pointer-events-none left-3 top-1/2 h-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                </div>
                {state?.validationErrors?.username && (
                    <div className="flex items-center space-x-1">
                        <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
                        <p className="text-sm text-red-500">{state.validationErrors.username[0]}</p>
                    </div>
                )}

                <label className="text-sm" htmlFor="email">Email:</label>
                <div className="w-full relative">
                    <Input className="peer w-full" type="text" name="email" id="email" placeholder="Enter email" autoComplete="email" required/>
                    <AtSymbolIcon className="w-5 absolute pointer-events-none left-3 top-1/2 h-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                </div>
                {state?.validationErrors?.email && (
                    <div className="flex items-center space-x-1">
                        <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
                        <p className="text-sm text-red-500">{state.validationErrors.email[0]}</p>
                    </div>
                )}

                <label className="text-sm" htmlFor="password">Password</label>
                <div className="w-full relative">
                    <Input className="peer w-full" type="password" name="password" id="password" placeholder="Enter password" required/>
                    <KeyIcon className="w-5 absolute pointer-events-none left-3 top-1/2 h-4 -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                </div>
                {state?.validationErrors?.password && (
                    <div className="flex items-center space-x-1">
                        <ExclamationCircleIcon className="h-4 w-4 text-red-500" />
                        <p className="text-sm text-red-500">{state.validationErrors.password[0]}</p>
                    </div>
                )}
            </section>
            {showSuccess && (
                <p className="text-green-600 text-center mb-4">
                    Account created successfully!
                </p>
            )}
            <Button className="mt-8" disabled={isPending}>{isPending ? 'Creating Account...' : 'Create Account'}</Button>
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