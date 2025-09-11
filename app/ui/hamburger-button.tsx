interface HamburgerButtonProps {
    isOpen: boolean;
    onClick: () => void;
}

export default function HamburgerButton({ isOpen, onClick }: HamburgerButtonProps) {
    return (
        <button
            onClick={onClick}
            className="
                max-[670px]:flex
                min-[671px]:hidden
                fixed
                top-4
                left-4
                z-50
                flex-col
                justify-center
                items-center
                w-10
                h-10
                bg-gray-900
                text-amber-50
                rounded-md
                hover:bg-gray-700
                transition-colors
                duration-200
                border
                border-gray-600
            "   
            aria-label={isOpen ? "Close menu" : "Open menu"}
        >
            {/* Hamburger lines that transform into X */}
            <div className={`w-6 h-0.5 bg-amber-50 transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-0.5' : 'mb-1'}`}></div>
            <div className={`w-6 h-0.5 bg-amber-50 transition-all duration-300 ${isOpen ? 'opacity-0' : 'mb-1'}`}></div>
            <div className={`w-6 h-0.5 bg-amber-50 transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-0.5' : ''}`}></div>
        </button>
    );
}