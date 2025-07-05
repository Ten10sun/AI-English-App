<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use App\Http\Requests\StoreThreadRequest;
use App\Http\Requests\UpdateThreadRequest;
use App\Models\Thread;
use App\Models\Message;
use Illuminate\Support\Facades\DB;

class ThreadController extends Controller
{
    /**
     * トップ画面の表示
     */
    public function index(): InertiaResponse
    {
        $threads = Thread::orderBy('id', 'desc')->get(['id', 'title']);

        // 本人のuser_idを取得
        $userId = auth()->id();

        // messagesテーブルから本人の登録数を日付ごとに集計
        $activity = DB::table('messages')
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->where('sender', 1)
            ->whereNotNull('audio_file_path')
            ->where('created_at', '>=', now()->subDays(364)->startOfDay())
            ->groupBy('date')
            ->pluck('count', 'date');

        return Inertia::render('Top', [
            'threads' => $threads,
            'activity' => $activity,
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
    public function store()
    {
        // 現在日時を日本時間（Asia/Tokyo）でタイトルとして新しいスレッドを作成
        $now = now()->setTimezone('Asia/Tokyo')->format('Y-m-d H:i:s');
        $thread = Thread::create([
            'title' => $now,
        ]);
        // 作成したスレッドのShowアクションへリダイレクト
        return redirect()->route('thread.show', ['threadId' => $thread->id]);
    }

    /**
     * 英会話画面の表示
     */
    public function show(int $threadId)
    {
        $messages = Message::where('thread_id', $threadId)->get(); //メッセージを取得
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
