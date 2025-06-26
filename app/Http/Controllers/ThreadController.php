<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use App\Http\Requests\StoreThreadRequest;
use App\Http\Requests\UpdateThreadRequest;
use App\Models\Thread;
use App\Models\Message;

class ThreadController extends Controller
{
    /**
     * トップ画面の表示
     */
    public function index(): InertiaResponse
    {
        $threads = Thread::orderBy('id', 'desc')->get(['id', 'title']); // 必要なカラムだけ取得し、降順で取得
        return Inertia::render('Top', [
            'threads' => $threads,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreThreadRequest $request)
    {
        //
    }

    /**
     * 英会話画面の表示
     */
    public function show(int $threadId)
    {
        $messages = Message::where('thread_id', $threadId)->get();//メッセージを取得
        $threads = Thread::orderBy('id', 'desc')->get(['id', 'title']); //スレッドを取得
        return Inertia::render('Thread/Show', [
            'threadId' => $threadId,
            'threads' => $threads,
            'messages' => $messages,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Thread $thread) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateThreadRequest $request, Thread $thread)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Thread $thread)
    {
        //
    }
}
