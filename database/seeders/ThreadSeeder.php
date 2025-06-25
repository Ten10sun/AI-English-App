<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Thread;

class ThreadSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Thread::create([
            'title' => '英会話レッスン',
        ]);
        Thread::create([
            'title' => '英会の本質とは',
        ]);
        Thread::create([
            'title' => '英会話の効果',
        ]);
        Thread::create([
            'title' => '英会話スレッド１',
        ]);
        Thread::create([
            'title' => '英会話スレッド２',
        ]);
        Thread::create([
            'title' => '英会話スレッド３',
        ]);
        Thread::create([
            'title' => '英会話スレッド４',
        ]);
        Thread::create([
            'title' => '英会話スレッド５',
        ]);
        Thread::create([
            'title' => '英会話スレッド６',
        ]);
        Thread::create([
            'title' => '英会話スレッド７',
        ]);
        Thread::create([
            'title' => '英会話スレッド８',
        ]);
        Thread::create([
            'title' => '英会話スレッド９',
        ]);
    }
}
