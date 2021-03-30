<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class GenreResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        //@fixme
        if ($request->route()->uri === "api/genres") {
            return parent::toArray($request) + [
                'categories' => CategoryResource::collection($this->categories)
            ];
        }
        return parent::toArray($request) + [
            'categories' => CategoryResource::collection($this->whenLoaded('categories'))
        ];
    }
}
