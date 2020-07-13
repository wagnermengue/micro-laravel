<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;
use Illuminate\Support\Collection;

class GenresHasCategoriesRule implements Rule
{
    /**
     * @var array
     */
    private $categoriesId;
    /**
     * @var mixed
     */
    private $genresId;

    /**
     * Create a new rule instance.
     *
     * @param array $categoriesId
     */
    public function __construct(array $categoriesId)
    {
        $this->categoriesId = array_unique($categoriesId);
    }

    /**
     * Determine if the validation rule passes.
     *
     * @param  string  $attribute
     * @param  mixed  $value
     * @return bool
     */
    public function passes($attribute, $value)
    {
        if (! is_array($value)) {
            $value = [];
        }
        $this->genresId = array_unique($value);
        if (! count($this->categoriesId) || ! count($this->genresId)) {
            return false;
        }

        $categoriesFounds = [];
        foreach ($this->genresId as $genreId) {
            $rows = $this->getRows($genreId);
            if (! $rows->count()) {
                return false;
            }
            array_push($categoriesFounds, ...$rows->pluck('category_id')->toArray());
        }
        $categoriesFounds = array_unique($categoriesFounds);
        if (count($categoriesFounds) !== count($this->categoriesId)) {
            return false;
        }
        return true;
    }

    /**
     * Get the validation error message.
     *
     * @return string
     */
    public function message()
    {
        return 'A genre ID must be related at least a category ID.';
    }

    protected function getRows($genreId) : Collection
    {
        return \DB::table('category_genre')
            ->where('genre_id', $genreId)
            ->whereIn('category_id', $this->categoriesId)
            ->get();
    }
}
