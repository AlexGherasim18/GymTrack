import SideNav from "../ui/side-nav";

export default function UserLayout({children}: {children: React.ReactNode}) {
    return (
        <main className="flex flex-row h-full">
            <SideNav />
            <section className="w-full overflow-hidden overflow-y-auto">{children}</section>
        </main>
    )
}