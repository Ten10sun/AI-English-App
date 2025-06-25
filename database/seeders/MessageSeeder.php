<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Message;
use App\Models\Thread;

class MessageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //メッセージデータを作成
        Message::create([
            'thread_id' => 1,
            'message_en' => 'Hello, how are you?',
            'message_ja' => 'こんにちは、お元気ですか？',
            'sender' => 1,//ユーザー
            'audio_file_path' => 'audio/message_1.mp3',
        ]);
        Message::create([
            'thread_id' => 1,
            'message_en' => 'I am fine, thank you.',
            'message_ja' => '元気です。ありがとうございます。',
            'sender' => 2,//AI
            'audio_file_path' => 'audio/message_2.mp3',
        ]);
        Message::create([
            'thread_id' => 1,
            'message_en' => 'Yesterday was sunny, wasn\'t it?',
            'message_ja' => '昨日って晴れだったっけ',
            'sender' => 1,//ユーザー
            'audio_file_path' => 'audio/message_3.mp3',
        ]);
        Message::create([
            'thread_id' => 1,
            'message_en' => 'Yes, it was sunny.',
            'message_ja' => '昨日は晴れていました。',
            'sender' => 2,//AI
            'audio_file_path' => 'audio/message_4.mp3',
        ]);
        Message::create([
            'thread_id' => 1,
            'message_en' => 'What did you eat for breakfast?',
            'message_ja' => '朝ごはんは何を食べましたか？',
            'sender' => 1, //ユーザー
            'audio_file_path' => 'audio/message_5.mp3',
        ]);
        Message::create([
            'thread_id' => 1,
            'message_en' => 'I ate toast and eggs.',
            'message_ja' => 'トーストと卵を食べました。',
            'sender' => 2, //AI
            'audio_file_path' => 'audio/message_6.mp3',
        ]);
        // もう1セット追加
        Message::create([
            'thread_id' => 2,
            'message_en' => 'What is the essence of English conversation?',
            'message_ja' => '英会話の本質とは何ですか？',
            'sender' => 1, //ユーザー
            'audio_file_path' => 'audio/message_7.mp3',
        ]);
        Message::create([
            'thread_id' => 2,
            'message_en' => 'The essence is communication, not perfection.',
            'message_ja' => '本質は完璧さではなくコミュニケーションです。',
            'sender' => 2, //AI
            'audio_file_path' => 'audio/message_8.mp3',
        ]);
        Message::create([
            'thread_id' => 2,
            'message_en' => 'I see. So making mistakes is okay?',
            'message_ja' => 'なるほど。間違えても大丈夫ですか？',
            'sender' => 1, //ユーザー
            'audio_file_path' => 'audio/message_9.mp3',
        ]);
        Message::create([
            'thread_id' => 2,
            'message_en' => 'Yes, mistakes help you learn.',
            'message_ja' => 'はい、間違いは学びにつながります。',
            'sender' => 2, //AI
            'audio_file_path' => 'audio/message_10.mp3',
        ]);
        Message::create([
            'thread_id' => 2,
            'message_en' => 'Thank you for your advice.',
            'message_ja' => 'アドバイスありがとうございます。',
            'sender' => 1, //ユーザー
            'audio_file_path' => 'audio/message_11.mp3',
        ]);
        Message::create([
            'thread_id' => 2,
            'message_en' => 'You are welcome. Let\'s enjoy learning together!',
            'message_ja' => 'どういたしまして。一緒に楽しく学びましょう！',
            'sender' => 2, //AI
            'audio_file_path' => 'audio/message_12.mp3',
        ]);
    }
}
