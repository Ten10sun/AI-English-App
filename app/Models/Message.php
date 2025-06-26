<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Thread;

class Message extends Model
{
    use HasFactory;

    /**
     * 一括代入可能な属性
     */
    protected $fillable = [
        'thread_id',
        'message_en',
        'message_ja',
        'sender',
        'audio_file_path',
    ];

    /**
     * メッセージが属するスレッド（多対1）
     */
    public function thread()
    {
        return $this->belongsTo(Thread::class);
    }

    public function getSenderAttribute($value)
    {
        if ($value == 1) return 'user';
        if ($value == 2) return 'ai';
        return $value;
    }
}
