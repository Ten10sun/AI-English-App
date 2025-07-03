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
                'message_en' => 'dummy message1', // 仮のメッセージ
                'message_ja' => 'ダミーメッセージ1', // 仮のメッセージ
                'sender' => 1, // 送信者: 1はユーザー
                'audio_file_path' => $path
            ]);

            // 音声データをAPIに送信する処理
            $apiService = new ApiService();
            $response = $apiService->callWhisperApi($path);
            $message_en = $response['text'];
            $message->update([
                'message_en' => $message_en,
                'message_ja' => 'ダミーメッセージ2', // ここは翻訳APIを使って翻訳することも可能
            ]);


            $messages = Message::where('thread_id', $threadId)->get();
            // GPTにAPIリクエスト
            $gptResponse = $apiService->callGptApi($messages);
            $aiMessageText = $gptResponse['choices'][0]['message']['content'] ?? 'No response from GPT';
            // 音声データを保存する処理
            $aiMessage = Message::create([
                'thread_id' => $threadId,
                'message_en' => $aiMessageText,
                'message_ja' => 'Aiのダミーメッセージ', // 仮のメッセージ
                'sender' => 2, // 送信者: 2はAI
                'audio_file_path' => null
            ]);

            // TTSにAPIリクエスト
            $aiAudioFilePath = $apiService->callTtsApi($aiMessageText);
            // dd('TTS Response:', $aiAudioFilePath);
            //　データベースに音声ファイルパスを保存
            $aiMessage->update([
                'audio_file_path' => $aiAudioFilePath
            ]);

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

    /**
     *  英文を日本語に翻訳
     */
    public function translate(Request $request, int $threadId, int $messageId)
    {
        $message = Message::where('thread_id', $threadId)->where('id', $messageId)->firstOrFail();
        $apiService = new ApiService();
        $translated = $apiService->callTranslateApi($message->message_en);
        $message->update(['message_ja' => $translated]);
        return response()->json([
            'status' => 'success',
            'message_ja' => $translated,
        ]);
    }
}
