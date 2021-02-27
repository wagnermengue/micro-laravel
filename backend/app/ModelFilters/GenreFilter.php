<?php

namespace App\ModelFilters;

use Illuminate\Database\Eloquent\Builder;

class GenreFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'is_active', 'created_at'];

    public function search($search)
    {
        return $this->where('name', 'LIKE', "%$search%");
    }

    public function categories($categories)
    {
        $idsOrNames = explode(',', $categories);
        return $this->whereHas('categories', function(Builder $query) use ($idsOrNames) {
            $query
                ->whereIn('id', $idsOrNames)
                ->orWhereIn('name', $idsOrNames);
        });
    }
}
