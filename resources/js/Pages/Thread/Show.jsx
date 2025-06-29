import { Head } from "@inertiajs/react";
import { SideMenu } from "@/Components/SideMenu";
import LogoutButton from "@/Components/LogoutButton";
import { useState, useRef } from "react";
import axios from "axios";

export default function Show({ threads = [], messages = [], threadId }) {
    const [sidebarWidth, setSidebarWidth] = useState(256);
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);

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
            document.removeEventListener("mousemove", doDrag);
            document.removeEventListener("mouseup", stopDrag);
        };

        document.addEventListener("mousemove", doDrag);
        document.addEventListener("mouseup", stopDrag);
    };

    // 録音開始/停止トグル
    const handleMicClick = async () => {
        if (!isRecording) {
            // 録音開始
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                });
                // サポートされているMIMEタイプを選択
                let mimeType = "";
                if (MediaRecorder.isTypeSupported("audio/webm")) {
                    mimeType = "audio/webm";
                } else if (MediaRecorder.isTypeSupported("audio/ogg")) {
                    mimeType = "audio/ogg";
                } else {
                    alert("このブラウザは音声録音に対応していません");
                    return;
                }
                const mediaRecorder = new window.MediaRecorder(stream, {
                    mimeType,
                });
                audioChunksRef.current = [];
                mediaRecorder.ondataavailable = (e) => {
                    if (e.data.size > 0) {
                        audioChunksRef.current.push(e.data);
                    }
                };
                mediaRecorder.onstop = async () => {
                    const audioBlob = new Blob(audioChunksRef.current, {
                        type: mimeType,
                    });
                    // 拡張子をMIMEタイプから決定
                    let ext = "webm";
                    if (mimeType === "audio/ogg") ext = "ogg";
                    const formData = new FormData();
                    formData.append("audio", audioBlob, `recorded.${ext}`);
                    setIsLoading(true);
                    try {
                        await axios.post(
                            `/thread/${threadId}/message`,
                            formData,
                            {
                                headers: {
                                    "Content-Type": "multipart/form-data",
                                },
                            }
                        );
                        window.location.reload();
                    } catch (err) {
                        alert("音声の送信に失敗しました");
                    } finally {
                        setIsLoading(false);
                    }
                };
                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
                setIsRecording(true);
            } catch (err) {
                alert("マイクの利用が許可されていません");
            }
        } else {
            // 録音停止
            if (mediaRecorderRef.current) {
                mediaRecorderRef.current.stop();
                setIsRecording(false);
            }
        }
    };

    return (
        <>
            <Head title="Show" />
            <SideMenu
                sidebarWidth={sidebarWidth}
                handleMouseDown={handleMouseDown}
                threads={threads}
            />
            <main
                style={{
                    marginLeft: `${sidebarWidth}px`,
                    background: "#23272F",
                }}
                className="flex-grow p-8 text-white relative overflow-y-auto h-screen"
            >
                <div className="flex justify-end mb-8">
                    <LogoutButton />
                </div>
                <h1 className="text-2xl font-bold mb-6">英会話画面</h1>
                {/* チャットエリア */}
                <div className="flex flex-col gap-4 max-w-3xl mx-auto px-4">
                    {messages.map((msg, idx) =>
                        msg.sender === "user" ? (
                            <div key={idx} className="flex justify-end">
                                <div className="flex items-center gap-2">
                                    <div className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold max-w-[60vw] break-words">
                                        {msg.message_en}
                                    </div>
                                    <span className="bg-gray-600 px-2 py-1 rounded-full text-sm">
                                        You
                                    </span>
                                </div>
                            </div>
                        ) : (
                            <div
                                key={idx}
                                className="flex justify-start items-center"
                            >
                                <span className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-bold mr-2">
                                    AI
                                </span>
                                <div className="flex items-center">
                                    <div className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-bold text-lg flex items-center max-w-[60vw] break-words">
                                        {msg.message_en}
                                    </div>
                                    {/* 音声再生ボタン */}
                                    <button
                                        className="ml-2 p-2 bg-gray-100 rounded-full hover:bg-gray-300"
                                        title="音声再生"
                                        onClick={() => {
                                            /* TODO: 音声再生処理 */
                                        }}
                                    >
                                        {/* スピーカーアイコン */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-gray-700"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 19V6l-2 2H5a2 2 0 00-2 2v4a2 2 0 002 2h2l2 2zm7-7a4 4 0 00-4-4m0 8a4 4 0 004-4m0 0a8 8 0 00-8-8"
                                            />
                                        </svg>
                                    </button>
                                    {/* 言語切替ボタン */}
                                    <button
                                        className="ml-2 p-2 bg-gray-100 rounded-full hover:bg-gray-300"
                                        title="言語切替"
                                        onClick={() => {
                                            /* TODO: 言語切替処理 */
                                        }}
                                    >
                                        {/* Aあアイコン */}
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5 text-gray-700"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <text
                                                x="2"
                                                y="17"
                                                fontSize="12"
                                                fontFamily="Arial"
                                            >
                                                Aあ
                                            </text>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        )
                    )}
                </div>
                {/* 右下マイクボタン */}
                <button
                    className={`fixed bottom-8 right-8 rounded-full w-20 h-20 flex items-center justify-center shadow-lg transition-colors duration-200 ${
                        isRecording
                            ? "bg-red-500 text-white animate-pulse"
                            : "bg-white text-gray-900"
                    }`}
                    onClick={handleMicClick}
                    title={isRecording ? "録音停止" : "録音開始"}
                >
                    {/* マイクアイコン */}
                    <svg
                        className="w-10 h-10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3zm5 11a5 5 0 01-10 0m5 8v3m-4 0h8"
                        />
                    </svg>
                </button>
            </main>
            {/* ローディングオーバーレイ */}
            {isLoading && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center"
                >
                    {/* シンプルな円形スピナー */}
                    <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            )}
        </>
    );
}
