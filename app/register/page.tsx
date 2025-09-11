import Link from "next/link";
import RegisterForm from "../ui/register-form";

export default function RegisterPage() {
    return (
        <main className="w-full max-w-96 mx-auto h-full flex flex-col items-center">
            <RegisterForm />
            <p>Already having an account? <Link href="/login" className="text-blue-700 font-semibold">Sign In</Link></p>
        </main>
    )
}