import SideNav from "../ui/side-nav";

export default function UserLayout({children}: {children: React.ReactNode}) {
    return (
        <main className="flex flex-row h-full">
            <SideNav />
            <section className="w-full">{children}</section>
        </main>
    )
}