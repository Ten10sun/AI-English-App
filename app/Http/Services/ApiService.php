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

        dd('$response->json()',$response->json()); // デバッグ用のダンプ

        return $response->json();
    }
}
