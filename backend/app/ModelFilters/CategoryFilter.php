<?php

namespace App\ModelFilters;

class CategoryFilter extends DefaultModelFilter
{
    public function search($search)
    {
        return $this->where('name', 'LIKE', "%$search%");
    }
}
