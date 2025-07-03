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

    // @param string $aiMessageText
    // TTS（Text-to-Speech）APIを呼び出す
    public function callTtsApi($aiMessageText)
    {
        $timestamp = now()->format('YmdHis');
        $fileName = "tts_{$timestamp}.mp3";
        $savePath = storage_path('app/public/ai_audio/' . $fileName);

        $apiKey = env('OPENAI_API_KEY');
        $url = $this->baseUrl . '/v1/audio/speech';
        $postData = [
            'model' => 'tts-1', // または 'gpt-4o-mini-tts' など利用可能なモデル名
            'input' => $aiMessageText,
            'voice' => 'alloy', // 必要に応じて他のvoiceも可
            'response_format' => 'mp3',
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $apiKey,
            'Content-Type: application/json',
        ]);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
        $audioData = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($audioData === false || $httpCode !== 200) {
            $error = curl_error($ch);
            curl_close($ch);
            throw new \Exception('TTS APIリクエスト失敗: ' . $error . ' (HTTP ' . $httpCode . ')');
        }
        curl_close($ch);

        // 保存ディレクトリがなければ作成
        $dir = dirname($savePath);
        if (!file_exists($dir)) {
            mkdir($dir, 0777, true);
        }
        file_put_contents($savePath, $audioData);

        // public/audio/tts_yyyymmddhhmmss.mp3 のようなパスを返す
        return 'ai_audio/' . $fileName;
    }

    // 英文を日本語に翻訳するAPI
    public function callTranslateApi($text)
    {
        $apiKey = env('OPENAI_API_KEY');
        $url = $this->baseUrl . '/v1/chat/completions';
        $postData = [
            'model' => 'gpt-4o-mini',
            'messages' => [
                [
                    'role' => 'system',
                    'content' => 'Translate the following English text into natural Japanese. Output only the translation.'
                ],
                [
                    'role' => 'user',
                    'content' => $text
                ]
            ],
        ];
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . $apiKey,
            'Content-Type' => 'application/json',
        ])->post($url, $postData);
        if ($response->failed()) {
            throw new \Exception('翻訳APIリクエスト失敗: ' . $response->body());
        }
        $json = $response->json();
        return $json['choices'][0]['message']['content'] ?? '';
    }
}
