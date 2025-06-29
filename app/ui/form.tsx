import clsx from "clsx";

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
    children: React.ReactNode;
}

export default function Form({className, children, action, method}: FormProps) {
    return (
        <form action={action} className={clsx("my-auto p-4 flex flex-col items-start justify-center bg-gray-50 rounded-sm", className)}>
            {children}
        </form>
    )
}