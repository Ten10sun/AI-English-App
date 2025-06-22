import { Head } from '@inertiajs/react'
import { SideMenu } from '@/Components/SideMenu'
import LogoutButton from "@/Components/LogoutButton"

export default function Top({}) {
    const days = Array.from({ length: 70 }, (_, i) => i + 1); // 7x10 のグリッド

    return (
        <>
            <Head title="Top" />
            <div className="flex min-h-screen">
                <SideMenu />
                <main className="flex-grow bg-[#424242] p-8 text-white">
                    <div className="flex justify-end mb-8">
                        <LogoutButton />
                    </div>
                    <h1 className="text-2xl font-bold mb-6">英会話学習記録</h1>
                    <div className="grid grid-cols-10 gap-4">
                        {days.map((day) => {
                            const bgColor = 'bg-gray-500';

                            return (
                                <div key={day} className={`aspect-square rounded-md ${bgColor}`}>
                                    {/* intentionally empty */}
                                </div>
                            );
                        })}
                    </div>
                </main>
            </div>
        </>
    )
}
