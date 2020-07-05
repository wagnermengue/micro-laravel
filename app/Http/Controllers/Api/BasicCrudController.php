<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

abstract class BasicCrudController extends Controller
{
    protected abstract function model();

    private $rules = [
        'name' => 'required|max:255',
        'is_active' => 'boolean',
    ];

    public function index()
    {
        return $this->model()::all();
    }

//    /**
//     * Store a newly created resource in storage.
//     *
//     * @param  \Illuminate\Http\Request  $request
//     * @return \Illuminate\Http\Response
//     */
//    public function store(Request $request)
//    {
//        $this->validate($request, $this->rules);
//        $category = Category::create($request->all());
//        $category->refresh();
//        return $category;
//    }
//
//    /**
//     * Display the specified resource.
//     *
//     * @param  \App\Models\Category  $category
//     * @return \Illuminate\Http\Response
//     */
//    public function show(Category $category)
//    {
//        return $category;
//    }
//
//    /**
//     * Update the specified resource in storage.
//     *
//     * @param  \Illuminate\Http\Request  $request
//     * @param  \App\Models\Category  $category
//     * @return \Illuminate\Http\Response
//     */
//    public function update(Request $request, Category $category)
//    {
//        $this->validate($request, $this->rules);
//        $category->update($request->all());
//        return $category;
//    }
//
//    /**
//     * Remove the specified resource from storage.
//     *
//     * @param  \App\Models\Category  $category
//     * @return \Illuminate\Http\Response
//     */
//    public function destroy(Category $category)
//    {
//        $category->delete();
//        return response()->noContent();
//    }
}
