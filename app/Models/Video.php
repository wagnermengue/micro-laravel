<?php

namespace App\Models;

use App\Traits\Uuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Video extends Model
{
    use SoftDeletes, Uuid;

    const RATING_LIST = [
        'L',
        '12',
        '14',
        '16',
        '18',
    ];

    public $incrementing = false;

    protected $fillable = [
        'title',
        'description',
        'year_launched',
        'opened',
        'rating',
        'duration',
    ];

    protected $dates = ['deleted_at'];

    protected $casts = [
        'id' => 'string',
        'opened' => 'boolean',
        'year_launched' => 'integer',
        'duration' => 'integer',
    ];

    public static function create(array $attributes = [])
    {
        try {
            \DB::beginTransaction();
            $obj = static::query()->create($attributes);
            //upload aqui
            \DB::commit();
            return $obj;
        } catch (\Exception $e) {
            if (isset($obj)) {
                //exclui arquivos
            }
            \DB::rollBack();
            throw $e;
        }
    }

    public function update(array $attributes = [], array $options = [])
    {
        try {
            \DB::beginTransaction();
            $saved = parent::update($attributes, $options);
            if ($saved) {
                //upload aqui
                //exclui os antigos
            }
            \DB::commit();
            return $saved;
        } catch (\Exception $e) {
            //exclui arquivos
            \DB::rollBack();
            throw $e;
        }
    }


    public function categories()
    {
        return $this->belongsToMany(Category::class)->withTrashed();
    }

    public function genres()
    {
        return $this->belongsToMany(Genre::class)->withTrashed();
    }
}
