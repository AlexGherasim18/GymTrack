import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({children, className, ...rest}: ButtonProps) {
    return (
        <button {...rest} className={clsx("flex items-center py-2 px-6 gap-2 h-10 rounded-2xl self-center mt-3 bg-blue-500 hover:bg-blue-900 cursor-pointer text-amber-50", className)}>{children}</button>
    )
}