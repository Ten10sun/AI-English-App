<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Message;

class Thread extends Model
{
    /** @use HasFactory<\Database\Factories\ThreadFactory> */
    use HasFactory;

    protected $fillable = [
        'title',
    ];

    /**
     * スレッドが持つメッセージ（1対多）
     */
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
