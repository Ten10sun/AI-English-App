import { Head } from '@inertiajs/react'
import { SideMenu } from '@/Components/SideMenu'
import LogoutButton from "@/Components/LogoutButton"

export default function Show({}) {
    return (
        <>
            <Head title="Show" />
            <div className="flex min-h-screen overflow-hidden">
                <SideMenu />
                <main className="flex-grow bg-[#424242] p-8 text-white relative overflow-y-auto h-screen">
                    <div className="flex justify-end mb-8">
                        <LogoutButton />
                    </div>
                    <h1 className="text-2xl font-bold mb-6">英会話画面</h1>
                    {/* チャットエリア */}
                    <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                        {/* ユーザーの発言 */}
                        <div className="flex justify-end">
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold">Hello!</div>
                                <span className="bg-gray-600 px-2 py-1 rounded-full text-sm">You</span>
                            </div>
                        </div>
                        {/* AIの発言 */}
                        <div className="flex justify-start items-center">
                            <span className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm font-bold mr-2">AI</span>
                            <div className="flex items-center">
                                <div className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-bold text-lg flex items-center">
                                    Hi !! How are you ?
                                </div>
                                <button className="ml-2 bg-gray-300 rounded px-2 py-1 flex items-center">
                                    {/* スピーカーアイコン */}
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zm7.07 2.93a10 10 0 010 10.14m2.83-7.07a14 14 0 010 14.14" /></svg>
                                </button>
                                <button className="ml-2 bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs font-bold">Aあ</button>
                            </div>
                        </div>
                        {/* ユーザーの発言 */}
                        <div className="flex justify-end">
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold">Hello!</div>
                                <span className="bg-gray-600 px-2 py-1 rounded-full text-sm">You</span>
                            </div>
                        </div>
                        {/* AIの発言 */}
                        <div className="flex justify-start items-center">
                            <span className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm font-bold mr-2">AI</span>
                            <div className="flex items-center">
                                <div className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-bold text-lg flex items-center">
                                    Hi !! How are you ?
                                </div>
                                <button className="ml-2 bg-gray-300 rounded px-2 py-1 flex items-center">
                                    {/* スピーカーアイコン */}
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zm7.07 2.93a10 10 0 010 10.14m2.83-7.07a14 14 0 010 14.14" /></svg>
                                </button>
                                <button className="ml-2 bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs font-bold">Aあ</button>
                            </div>
                        </div>
                        {/* ユーザーの発言 */}
                        <div className="flex justify-end">
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold">Hello!</div>
                                <span className="bg-gray-600 px-2 py-1 rounded-full text-sm">You</span>
                            </div>
                        </div>
                        {/* AIの発言 */}
                        <div className="flex justify-start items-center">
                            <span className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm font-bold mr-2">AI</span>
                            <div className="flex items-center">
                                <div className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-bold text-lg flex items-center">
                                    Hi !! How are you ?
                                </div>
                                <button className="ml-2 bg-gray-300 rounded px-2 py-1 flex items-center">
                                    {/* スピーカーアイコン */}
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zm7.07 2.93a10 10 0 010 10.14m2.83-7.07a14 14 0 010 14.14" /></svg>
                                </button>
                                <button className="ml-2 bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs font-bold">Aあ</button>
                            </div>
                        </div>
                        {/* ユーザーの発言 */}
                        <div className="flex justify-end">
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold">Hello!</div>
                                <span className="bg-gray-600 px-2 py-1 rounded-full text-sm">You</span>
                            </div>
                        </div>
                        {/* AIの発言 */}
                        <div className="flex justify-start items-center">
                            <span className="bg-gray-300 text-gray-800 px-4 py-2 rounded-full text-sm font-bold mr-2">AI</span>
                            <div className="flex items-center">
                                <div className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-bold text-lg flex items-center">
                                    Hi !! How are you ?
                                </div>
                                <button className="ml-2 bg-gray-300 rounded px-2 py-1 flex items-center">
                                    {/* スピーカーアイコン */}
                                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 5L6 9H2v6h4l5 4V5zm7.07 2.93a10 10 0 010 10.14m2.83-7.07a14 14 0 010 14.14" /></svg>
                                </button>
                                <button className="ml-2 bg-gray-300 text-gray-800 px-3 py-1 rounded text-xs font-bold">Aあ</button>
                            </div>
                        </div>





                        {/* ユーザーの発言 */}
                        <div className="flex justify-end">
                            <div className="flex items-center gap-2">
                                <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-semibold">I'm good.</div>
                                <span className="bg-gray-600 px-2 py-1 rounded-full text-sm">You</span>
                            </div>
                        </div>
                    </div>
                    {/* 右下マイクボタン */}
                    <button className="fixed bottom-8 right-8 bg-white text-gray-900 rounded-full w-20 h-20 flex items-center justify-center shadow-lg">
                        {/* マイクアイコン */}
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zm5 11a5 5 0 01-10 0m5 8v3m-4 0h8" />
                        </svg>
                    </button>
                </main>
            </div>
        </>
    )
}
