"use client";

import { Sidebar } from "flowbite-react";
import { HiChatBubbleLeftRight, HiPlusCircle } from "react-icons/hi2";

export function SideMenu() {
    return (
        <div className="fixed top-0 left-0 h-screen w-64 bg-[#4A6D4D] z-10">
            <div className="p-4 flex items-center text-white">
                <img src="/favicon.png" alt="Logo" className="h-8 w-8 mr-3" />
                <span className="font-bold text-xl">MyEnglishApp</span>
            </div>
            <Sidebar aria-label="Side menu" className="w-full h-full bg-inherit" theme={{
                root: {
                    base: "h-full",
                    inner: "h-full overflow-y-auto overflow-x-hidden rounded bg-inherit px-3 py-0",
                },
                item: {
                    base: "flex items-center justify-center rounded-lg p-2 text-base font-normal text-white hover:bg-[#5a8a5d]",
                    icon: {
                        base: "h-6 w-6 flex-shrink-0 text-white transition duration-75 group-hover:text-white",
                    }
                }
            }}>
                <Sidebar.Items>
                    <Sidebar.ItemGroup>
                        <Sidebar.Item href="#" icon={HiPlusCircle}>
                            新規スレッド作成
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 1
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 2
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 3
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                        <Sidebar.Item href="#" icon={HiChatBubbleLeftRight}>
                            英会話スレッド 4
                        </Sidebar.Item>
                    </Sidebar.ItemGroup>
                </Sidebar.Items>
            </Sidebar>
        </div>
    );
}
