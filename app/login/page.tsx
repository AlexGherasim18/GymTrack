import Link from "next/link"
import LoginForm from "../ui/login-form"

export default function LoginPage() {
    return (
        <main className="w-full max-w-96 mx-auto h-full flex flex-col items-center">
            <LoginForm />
            <p>Don&apos;t have an account yet? <Link href="/register" className="text-blue-700 font-semibold">Sign Up</Link></p>
        </main>
    )
}