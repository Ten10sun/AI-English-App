"use client";

import { Sidebar } from "flowbite-react";
import { HiChatBubbleLeftRight, HiPlusCircle, HiTrash } from "react-icons/hi2";
import { Link, router } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export function SideMenu({ sidebarWidth = 256, handleMouseDown = () => {}, threads = [], onThreadTitleUpdate }) {
    const [editingThreadId, setEditingThreadId] = useState(null);
    const [editingTitle, setEditingTitle] = useState('');
    const [localThreads, setLocalThreads] = useState(threads);
    const clickTimeout = useRef(null);
    const [hoveredThreadId, setHoveredThreadId] = useState(null);

    useEffect(() => {
        setLocalThreads(threads);
    }, [threads]);

    // 編集済みかどうかを判定するためのヘルパー
    const isInitialTitle = (title) => {
        // 日時形式（例: 2025-07-03 09:39:15）ならtrue
        return /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(title);
    };

    // スレッドタイトル編集開始
    const handleTitleDoubleClick = (thread) => {
        console.log('ダブルクリック:', thread);
        setEditingThreadId(thread.id);
        // 初回（日時形式）のみ空文字、それ以外は前回タイトル
        setEditingTitle(isInitialTitle(thread.title) ? '' : thread.title);
    };

    // 編集確定
    const handleTitleSave = async (threadId) => {
        if (!editingTitle.trim()) return;
        try {
            await axios.put(route('thread.update', { thread: threadId }), { title: editingTitle });
            const updatedThreads = localThreads.map(t => t.id === threadId ? { ...t, title: editingTitle } : t);
            setLocalThreads(updatedThreads);
            if (onThreadTitleUpdate) onThreadTitleUpdate(updatedThreads);
        } catch (e) {
            alert('タイトルの更新に失敗しました');
        }
        setEditingThreadId(null);
        setEditingTitle('');
    };

    // スレッド削除ハンドラ（仮実装）
    const handleDeleteThread = (threadId) => {
        if (window.confirm('本当にこのスレッドを削除しますか？（元に戻せません）')) {
            // ここでAPI呼び出し予定
            setLocalThreads(localThreads.filter(t => t.id !== threadId));
            // TODO: バックエンド連携
        }
    };

    return (
        <div style={{ width: `${sidebarWidth}px` }} className="fixed top-0 left-0 h-screen bg-[#4A6D4D] z-10 flex flex-col">
            <div
                onMouseDown={handleMouseDown}
                className="absolute top-0 right-0 h-full w-2 cursor-ew-resize"
            />
            <div className="p-4 flex items-center text-white flex-shrink-0">
                <Link href={route('top')} className="flex items-center gap-2 focus:outline-none">
                    <img src="/favicon.png" alt="Logo" className="h-8 w-8 mr-3" />
                    <span className="font-bold text-xl">MyEnglishApp</span>
                </Link>
            </div>
            <div className="flex-1 min-h-0">
                <Sidebar aria-label="Side menu" className="w-full h-full bg-inherit flex-1" theme={{
                    root: {
                        base: "h-full flex-1",
                        inner: "h-full flex-1 overflow-y-auto overflow-x-hidden rounded bg-inherit px-3 py-0",
                    },
                    item: {
                        base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-white hover:bg-[#5a8a5d]",
                        icon: {
                            base: "h-6 w-6 flex-shrink-0 text-white transition duration-75 group-hover:text-white",
                        }
                    }
                }}>
                    <Sidebar.Items className="h-full flex-1 overflow-y-auto">
                        <Sidebar.ItemGroup>
                            <Sidebar.Item
                                href={route('thread.store')}
                                icon={() => (
                                    <span
                                        className="bg-[#4A6D4D] rounded-full p-1 flex items-center justify-center"
                                    >
                                        <HiPlusCircle className="h-6 w-6 text-white" />
                                    </span>
                                )}
                            >
                                新規スレッド作成
                            </Sidebar.Item>
                            {localThreads.map(thread => (
                                editingThreadId === thread.id ? (
                                    <div key={thread.id} className="flex items-center gap-2 p-2 bg-[#5a8a5d] rounded-lg mb-1">
                                        <HiChatBubbleLeftRight className="h-6 w-6 text-white" />
                                        <input
                                            type="text"
                                            value={editingTitle}
                                            autoFocus
                                            onChange={e => setEditingTitle(e.target.value)}
                                            onBlur={() => handleTitleSave(thread.id)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') handleTitleSave(thread.id);
                                                if (e.key === 'Escape') { setEditingThreadId(null); setEditingTitle(''); }
                                            }}
                                            className="w-full rounded px-2 py-1 text-black"
                                        />
                                    </div>
                                ) : (
                                    <div
                                        key={thread.id}
                                        className="flex items-center justify-between gap-2 p-2 hover:bg-[#5a8a5d] rounded-lg mb-1 cursor-pointer"
                                        onClick={e => {
                                            if (editingThreadId === thread.id) return;
                                            if (clickTimeout.current) clearTimeout(clickTimeout.current);
                                            clickTimeout.current = setTimeout(() => {
                                                router.visit(route('thread.show', { threadId: thread.id }));
                                            }, 200);
                                        }}
                                        onDoubleClick={e => {
                                            if (clickTimeout.current) clearTimeout(clickTimeout.current);
                                            e.stopPropagation();
                                            handleTitleDoubleClick(thread);
                                        }}
                                        onMouseEnter={() => setHoveredThreadId(thread.id)}
                                        onMouseLeave={() => setHoveredThreadId(null)}
                                    >
                                        <div className="flex items-center gap-2 min-w-0">
                                            <HiChatBubbleLeftRight className="h-6 w-6 text-white flex-shrink-0" />
                                            <span className="text-white truncate" style={{maxWidth: '120px'}}>{thread.title}</span>
                                        </div>
                                        {hoveredThreadId === thread.id ? (
                                            <button
                                                className="p-0.5 rounded transition-colors duration-150 group flex items-center justify-center"
                                                title="スレッド削除"
                                                style={{marginLeft: '4px'}}
                                                onClick={e => {
                                                    e.stopPropagation();
                                                    handleDeleteThread(thread.id);
                                                }}
                                            >
                                                <span className="group-hover:bg-red-600 rounded p-0.5 transition-colors duration-150 flex items-center justify-center">
                                                    <HiTrash className="h-5 w-5 text-white" />
                                                </span>
                                            </button>
                                        ) : (
                                            // ゴミ箱アイコン用スペースを常に確保（透明アイコン）
                                            <span style={{width: '28px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginLeft: '4px'}}>
                                                <HiTrash className="h-5 w-5 text-transparent" />
                                            </span>
                                        )}
                                    </div>
                                )
                            ))}
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>
            </div>
        </div>
    );
}
