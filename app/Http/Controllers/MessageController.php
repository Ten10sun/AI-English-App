<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function store(Request $request, $threadId)
    {
        // 音声データを保存
        // 音声データがある場合は、リクエストから音声データを取得し、保存する処理を実装します。
        // 例: $audio = $request->file('audio');
        if ($request->hasFile('audio')) {
            $audio = $request->file('audio');
            $timestamp = now()->format('YmdHis');
            $extension = $audio->getClientOriginalExtension() ?: 'webm';
            $path = $audio->storeAs('audio', "audio_{$timestamp}.{$extension}");
            // 音声データを保存する処理

            // $validated = $request->validate([
            //     'message' => 'required|string|max:1000',
            // ]);

            // // メッセージを保存する処理
            // // ...

            // return redirect()->route('thread.show', ['threadId' => $threadId]);
        }
    }
}
