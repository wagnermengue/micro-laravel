<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Genre extends Model
{
    use SoftDeletes, Uuid;

    public $incrementing = false;

    protected $fillable = [
        'name',
        'is_active',
    ];

    protected $date = [
        'deleted_at',
    ];

    protected $casts = [
        'id' => 'string',
    ];
}
