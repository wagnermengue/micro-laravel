<?php

namespace Tests\Stubs\Controllers;

use App\Http\Controllers\Api\BasicCrudController;
use Tests\Stubs\Models\CategoryStub;

class CategoryControllerStub extends BasicCrudController
{

    protected function model()
    {
        return CategoryStub::class;
    }

    protected function rulesStore()
    {
        return [
            'name' => 'required|max:255',
            'description' => 'nullable',
        ];
    }

    protected function rulesUpdate()
    {
        return [
            'name' => 'required|max:255',
            'description' => 'nullable',
        ];
    }

    protected function resourceCollection()
    {
        // TODO: Implement resourceCollection() method.
    }

    protected function resource()
    {
        // TODO: Implement resource() method.
    }
}
