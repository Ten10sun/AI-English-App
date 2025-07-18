import { Head } from "@inertiajs/react";
import { SideMenu } from "@/Components/SideMenu";
import LogoutButton from "@/Components/LogoutButton";
import BackToTopButton from "@/Components/BackToTopButton";
import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function Show({ threads = [], messages = [], threadId }) {
    const [sidebarWidth, setSidebarWidth] = useState(256);
    const [isRecording, setIsRecording] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRefs = useRef({});
    const latestAiAudioRef = useRef(null);
    const [playingIdx, setPlayingIdx] = useState(null);
    const [autoPlayFailedIdx, setAutoPlayFailedIdx] = useState(null);
    const [translatingIdx, setTranslatingIdx] = useState(null);
    const [translatedJas, setTranslatedJas] = useState({}); // { idx: ja }
    const prevMessagesRef = useRef([]);
    const prevAICountRef = useRef(0);
    const isFirstRender = useRef(true);
    const [shouldAutoPlayNextAi, setShouldAutoPlayNextAi] = useState(false);
    const [localMessages, setLocalMessages] = useState(messages);
    const [highlightedAiId, setHighlightedAiId] = useState(null);

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

    const playSilentAudio = () => {
        // AudioContextを使って無音を再生
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const source = ctx.createBufferSource();
        source.buffer = ctx.createBuffer(1, 1, 22050); // 1ch, 1サンプル, 22050Hz
        source.connect(ctx.destination);
        source.start(0);
    };

    // 録音開始/停止トグル
    const handleMicClick = async () => {
        playSilentAudio(); // ここで無音再生
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
                        setShouldAutoPlayNextAi(true); // 音声送信成功時にフラグON
                        // 新しいmessagesを取得
                        const res = await axios.get(`/thread/${threadId}/messages`);
                        setLocalMessages(res.data.messages);
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

    const getAudioUrl = (audioPath) => {
        if (!audioPath) return null;
        if (audioPath.startsWith('/storage/')) return audioPath;
        return `/storage/${audioPath}`;
    };

    const playAudio = (audioPath, refObj, idx = null) => {
        const url = getAudioUrl(audioPath);
        if (!url) return;
        if (idx !== null && refObj.current[idx]) {
            refObj.current[idx].pause();
            refObj.current[idx].currentTime = 0;
        } else if (idx === null && refObj.current) {
            refObj.current.pause();
            refObj.current.currentTime = 0;
        }
        const audio = new Audio(url);
        audio.onerror = (e) => {
            alert('音声ファイルの再生に失敗しました: ' + url);
            console.error('Audio error:', e);
        };
        if (idx !== null) {
            refObj.current[idx] = audio;
        } else {
            refObj.current = audio;
        }
        audio.play().catch((e) => {
            alert('自動再生エラー: ' + e.message);
            console.warn('自動再生がブロックされました:', e);
        });
    };

    // 新規AI返答が来た直後だけhighlightedAiIdをセット
    useEffect(() => {
        const aiMessages = localMessages.filter(msg => msg.sender === "ai" && msg.audio_file_path);
        const latestAiMsg = aiMessages[aiMessages.length - 1];
        if (aiMessages.length > prevAICountRef.current && latestAiMsg) {
            setHighlightedAiId(latestAiMsg.id);
        }
        prevAICountRef.current = aiMessages.length;
    }, [localMessages]);

    const handlePlayAudio = (audioPath, idx, messageId) => {
        if (!audioPath) return;
        // すでに再生中なら停止
        if (playingIdx === idx && audioRefs.current[idx]) {
            audioRefs.current[idx].pause();
            audioRefs.current[idx].currentTime = 0;
            setPlayingIdx(null);
            return;
        }
        // 他の再生中音声があれば停止
        if (playingIdx !== null && audioRefs.current[playingIdx]) {
            audioRefs.current[playingIdx].pause();
            audioRefs.current[playingIdx].currentTime = 0;
        }
        const audio = new Audio(`/storage/${audioPath}`);
        audioRefs.current[idx] = audio;
        audio.onended = () => {
            setPlayingIdx(null);
        };
        audio.onerror = (e) => {
            alert('音声ファイルの再生に失敗しました: ' + audioPath);
            setPlayingIdx(null);
        };
        audio.play().then(() => {
            setPlayingIdx(idx);
            setHighlightedAiId(null); // 再生したら黄色解除
        });
    };

    // 翻訳ボタンクリック
    const handleTranslate = async (msg, idx) => {
        // すでに翻訳済みなら非表示トグル
        if (translatedJas[idx]) {
            setTranslatedJas(prev => {
                const newObj = { ...prev };
                delete newObj[idx];
                return newObj;
            });
            return;
        }
        setTranslatingIdx(idx);
        try {
            const res = await axios.post(`/thread/${threadId}/message/${msg.id}/translate`);
            setTranslatedJas(prev => ({ ...prev, [idx]: res.data.message_ja }));
        } catch (e) {
            alert('翻訳に失敗しました');
        } finally {
            setTranslatingIdx(null);
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
                <div className="flex justify-between mb-8">
                    <BackToTopButton />
                    <LogoutButton />
                </div>
                <h1 className="text-2xl font-bold mb-6">英会話画面</h1>
                {/* チャットエリア */}
                <div className="flex flex-col gap-4 max-w-3xl mx-auto px-4">
                    {localMessages.map((msg, idx) => {
                        if (msg.sender === "ai") {
                            console.log('AI audio_file_path:', msg.audio_file_path);
                        }
                        return msg.sender === "user" ? (
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
                            <div key={idx}>
                                <div className="flex justify-start items-center">
                                    <span className="bg-gray-600 text-white px-4 py-2 rounded-full text-sm font-bold mr-2">
                                        AI
                                    </span>
                                    <div className="flex items-center">
                                        <div className="bg-gray-200 text-gray-900 px-6 py-2 rounded-lg font-bold text-lg flex items-center max-w-[60vw] break-words">
                                            {msg.message_en}
                                        </div>
                                        {/* 音声再生ボタン */}
                                        <button
                                            className={`ml-2 p-2 rounded-full ${highlightedAiId === msg.id ? 'bg-yellow-400 animate-pulse' : 'bg-blue-400'} hover:bg-blue-500`}
                                            title={playingIdx === idx ? "音声停止" : "音声再生"}
                                            onClick={() => handlePlayAudio(msg.audio_file_path, idx, msg.id)}
                                        >
                                            {playingIdx === idx ? (
                                                // 停止アイコン
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="white">
                                                    <rect x="6" y="6" width="8" height="8" rx="2" />
                                                </svg>
                                            ) : (
                                                // 再生アイコン
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="white">
                                                    <path d="M9 7H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4l5 4V3l-5 4z"/>
                                                </svg>
                                            )}
                                        </button>
                                        {/* 言語切替ボタン */}
                                        <button
                                            className="ml-2 p-2 bg-gray-100 rounded-full hover:bg-gray-300"
                                            title="言語切替"
                                            onClick={() => handleTranslate(msg, idx)}
                                            disabled={translatingIdx === idx}
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
                                {/* 翻訳結果をAI英文の直下に表示 */}
                                {translatedJas[idx] && (
                                    <div className="text-green-300 text-base font-bold bg-gray-800 rounded px-4 py-2 mt-1 ml-14 max-w-[60vw]">
                                        {translatedJas[idx]}
                                    </div>
                                )}
                                {/* 翻訳中スピナーも直下に */}
                                {translatingIdx === idx && (
                                    <div className="text-yellow-400 text-sm flex items-center gap-2 ml-14 mt-1">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        翻訳中...
                                    </div>
                                )}
                            </div>
                        )
                    })}
                    <div style={{ height: "96px" }}></div> {/* w-20 h-20 = 80px + 余裕で96px */}
                </div>
                {/* ガイダンス */}
                {autoPlayFailedIdx !== null && (
                    <div className="text-sm text-yellow-400 mb-2">
                        ブラウザの仕様により自動再生がブロックされました。スピーカーボタンを押して音声を再生してください。
                    </div>
                )}
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
