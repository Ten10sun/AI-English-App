import { Head } from '@inertiajs/react'
import { SideMenu } from '@/Components/SideMenu'
import LogoutButton from "@/Components/LogoutButton"
import { useState } from 'react';

export default function Top({}) {
    const [sidebarWidth, setSidebarWidth] = useState(256);

    const handleMouseDown = (e) => {
        e.preventDefault();
        const startX = e.clientX;
        const startWidth = sidebarWidth;

        const doDrag = (e) => {
            const newWidth = startWidth + e.clientX - startX;
            if (newWidth >= 200 && newWidth <= 500) {
                setSidebarWidth(newWidth);
            }
        };

        const stopDrag = () => {
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
        };

        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
    };

    const days = Array.from({ length: 70 }, (_, i) => i + 1); // 7x10 のグリッド

    return (
        <>
            <Head title="Top" />
            <SideMenu sidebarWidth={sidebarWidth} handleMouseDown={handleMouseDown} />
            <main style={{ marginLeft: `${sidebarWidth}px` }} className="flex-grow bg-[#424242] p-8 text-white min-h-screen">
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
        </>
    )
}
