<?php

namespace App\Http\Controllers\Api;

use App\Http\Resources\VideoResource;
use App\Models\Video;
use App\Rules\GenresHasCategoriesRule;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Http\Request;

class VideoController extends BasicCrudController
{

    private $rules;

    public function __construct()
    {
        $this->rules = [
            'title' => 'required|max:255',
            'description' => 'required',
            'year_launched' => 'required|date_format:Y|min:1',
            'opened' => 'boolean',
            'rating' => 'required|in:' . implode(',', Video::RATING_LIST),
            'duration' => 'required|integer|min:1',
            'categories_id' => 'required|array|exists:categories,id,deleted_at,NULL',
            'genres_id' => [
                'required',
                'array',
                'exists:genres,id,deleted_at,NULL'
            ],
            'cast_member_id' => [
                'required',
                'array',
                'exists:cast_members,id,deleted_at,NULL'
            ],
            'thumb_file' => 'image|max:' . Video::THUMB_FILE_MAX_SIZE,
            'banner_file' => 'image|max:' . Video::BANNER_FILE_MAX_SIZE,
            'trailer_file' => 'mimetypes:video/mp4|max:' . Video::TRAILER_FILE_MAX_SIZE,
            'video_file' => 'mimetypes:video/mp4|max:' . Video::VIDEO_FILE_MAX_SIZE,
        ];
    }

    public function store(Request $request)
    {
        $this->addRuleIfGenresHasCategories($request);
        $validatedData = $this->validate($request, $this->rulesStore());
        $obj = $this->model()::create($validatedData);
        $obj->refresh();
        $resource = $this->resource();
        return new $resource($obj);
    }

    public function update(Request $request, $id)
    {
        $obj = $this->findOrFail($id);
        $this->addRuleIfGenresHasCategories($request);
        $validatedData = $this->validate($request, $this->rulesUpdate());
        $obj->update($validatedData);

        $resource = $this->resource();
        return new $resource($obj);
    }

    protected function addRuleIfGenresHasCategories(Request $request)
    {
        $categoriesId = $request->get('categories_id');
        $categoriesId = is_array($categoriesId) ? $categoriesId : [];
        $this->rules['genres_id'][] = new GenresHasCategoriesRule($categoriesId);
    }

    protected function model()
    {
        return Video::class;
    }

    protected function rulesStore()
    {
        return $this->rules;
    }

    protected function rulesUpdate()
    {
        return $this->rules;
    }

    protected function resourceCollection()
    {
        return $this->resource();
    }

    protected function resource()
    {
        return VideoResource::class;
    }

    protected function queryBuilder(): Builder
    {
        $action = \Route::getCurrentRoute()->getAction()['uses'];
        return parent::queryBuilder()->with([
            strpos($action, 'index') !== false
                ? 'genres'
                : 'genres.categories',
            'categories',
            'castMembers'
        ]);
    }
}
