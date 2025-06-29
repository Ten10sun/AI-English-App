<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Http;

class ApiService
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = 'https://api.openai.com';
    }

    public function callWhisperApi($audioFilePath)
    {
        // $audioFilePathのデータはaudio/audio_20250626095239.webm のような形式が格納されている
        $fullPath = storage_path('app/public/' . $audioFilePath);
        if (!file_exists($fullPath)) {
            throw new \Exception('音声ファイルが見つかりません: ' . $fullPath);
        }

        $response = Http::attach(
            'file',
            file_get_contents($fullPath),
            basename($audioFilePath)
        )->withHeaders([
            'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
        ])->post($this->baseUrl . '/v1/audio/transcriptions', [
            'model' => 'whisper-1',
            'language' => 'en', // ここで英語を指定
        ]);

        if ($response->failed()) {
            throw new \Exception('Whisper APIリクエスト失敗: ' . $response->body());
        }

        // dd('$response->json()',$response->json()); // デバッグ用のダンプ

        return $response->json();
    }

    // @param Collection<Message> $modelMessages
    public function callGptApi($modelMessages)
    {
        // OpenAI API用のメッセージ配列に変換
        $openAiMessages = [];
        // システムプロンプト（必要に応じて調整）
        $openAiMessages[] = [
            'role' => 'system',
            'content' => 'You are a helpful English conversation partner. Please reply in simple, natural English.'
        ];
        foreach ($modelMessages as $message) {
            // sender: 1→user, 2→assistant
            $role = $message->sender === 'user' ? 'user' : 'assistant';
            // 空メッセージはスキップ
            if (empty($message->message_en)) continue;
            $openAiMessages[] = [
                'role' => $role,
                'content' => $message->message_en
            ];
        }
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
            'Content-Type' => 'application/json',
        ])->post($this->baseUrl . '/v1/chat/completions', [
            'model' => 'gpt-4o-mini',
            'messages' => $openAiMessages,
        ]);
        if ($response->failed()) {
            throw new \Exception('GPT APIリクエスト失敗: ' . $response->body());
        }

        // dd('$response->json()', $response->json()); // デバッグ用のダンプ
        return $response->json();
    }
}
