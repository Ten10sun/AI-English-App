import { Head } from '@inertiajs/react'
import { SideMenu } from '@/Components/SideMenu'
import LogoutButton from "@/Components/LogoutButton"
import { useState } from 'react';
import ContributionCalendar from "@/Components/ContributionCalendar";
import { subDays, format } from "date-fns";

export default function Top({ threads = [], activity = {} }) {
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

    // 直近182日分（半年分）の配列を作成
    const days = 182;
    const today = new Date();
    const daysData = Array.from({ length: days }, (_, i) => {
        const date = format(subDays(today, days - 1 - i), "yyyy-MM-dd");
        return activity[date] || 0;
    });

    const getColor = (count) => {
        if (count >= 10) return "bg-github-4";
        if (count >= 6) return "bg-github-3";
        if (count >= 3) return "bg-github-2";
        if (count >= 1) return "bg-github-1";
        return "bg-github-0";
    };

    return (
        <>
            <Head title="Top" />
            <SideMenu sidebarWidth={sidebarWidth} handleMouseDown={handleMouseDown} threads={threads} />
            <main style={{ marginLeft: `${sidebarWidth}px` }} className="flex-grow bg-[#424242] p-8 text-white min-h-screen">
                <div className="flex justify-end mb-8">
                    <LogoutButton />
                </div>
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-6">英会話学習記録</h1>
                    <div className="mb-6 text-lg text-green-200 font-semibold">
                        英会話をするとカレンダーに草（色）が生えるよ！<br />
                        たくさん会話して、カレンダーを緑でいっぱいにしよう！<br />
                        <span className="text-yellow-300 font-bold">頑張れば花も咲くよ🌻</span>
                    </div>
                </div>
                <ContributionCalendar daysData={daysData} />
            </main>
        </>
    )
}
