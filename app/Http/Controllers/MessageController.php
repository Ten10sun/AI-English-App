<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Http\Services\ApiService;

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
            $path = $audio->storeAs('audio', "audio_{$timestamp}.{$extension}", 'public');

            // 音声データを保存する処理
            $message = Message::create([
                'thread_id' => $threadId,
                'message_en' => 'dummy message', // 仮のメッセージ
                'message_ja' => 'ダミーメッセージ', //  仮のメッセージ
                'sender' => 1, // 送信者: 1はユーザー
                'audio_file_path' => $path
            ]);

            //音声データをAPIに送信する処理
            $apiService = new ApiService();
            $apiService->callWhisperApi($path);



            return response()->json([
                'status' => 'success',
                'message' => 'Message saved successfully',
                'data' => $message
            ], 201);
        }
        return response()->json([
            'status' => 'error',
            'message' => 'No audio file provided'
        ], 400);
    }
}
