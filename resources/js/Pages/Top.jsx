import { Head } from '@inertiajs/react'
import { SideMenu } from '@/Components/SideMenu'
import LogoutButton from "@/Components/LogoutButton"
import { useState } from 'react';
import ContributionCalendar from "@/Components/ContributionCalendar";

export default function Top({ threads = [] }) {
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

    // 仮のデータ（例: ランダムな活動量）
    const daysData = Array.from({ length: 70 }, () => Math.floor(Math.random() * 5));

    return (
        <>
            <Head title="Top" />
            <SideMenu sidebarWidth={sidebarWidth} handleMouseDown={handleMouseDown} threads={threads} />
            <main style={{ marginLeft: `${sidebarWidth}px` }} className="flex-grow bg-[#424242] p-8 text-white min-h-screen">
                <div className="flex justify-end mb-8">
                    <LogoutButton />
                </div>
                <h1 className="text-2xl font-bold mb-6">英会話学習記録</h1>
                <ContributionCalendar daysData={daysData} />
            </main>
        </>
    )
}
