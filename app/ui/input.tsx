import clsx from "clsx";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: string;
    name: string;
    id: string;
    placeholder?: string;
}

export default function Input({className, type, name, id, placeholder, ...rest}: InputProps) {
    return (
        <input {...rest} type={type} name={name} id={id} placeholder={placeholder} className={clsx("rounded-md border border-gray-200 py-2.5 pl-10 text-sm  placeholder:text-gray-500", className)}/>
    )
}