<?php

namespace App\ModelFilters;

use Illuminate\Database\Eloquent\Builder;

class CategoryFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'is_active', 'created_at'];

    public function search($search)
    {
        return $this->where('name', 'LIKE', "%$search%");
    }

    public function genres($genres)
    {
        $ids = explode(',', $genres);
        return $this->whereHas('genres', function(Builder $query) use ($ids) {
            $query->whereIn('id', $ids);
        });
    }
}
