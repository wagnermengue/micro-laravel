<?php

namespace App\ModelFilters;

class CategoryFilter extends DefaultModelFilter
{
    protected $sortable = ['name', 'is_active', 'created_at'];

    public function search($search)
    {
        return $this->where('name', 'LIKE', "%$search%");
    }
}
