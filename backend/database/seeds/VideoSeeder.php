<?php

use App\Models\Genre;
use App\Models\Video;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;

class VideoSeeder extends Seeder
{
    private $allGenres;

    private $relations = [
        'genres_id' => [],
        'categories_id' => [],
    ];
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $dir = \Storage::getDriver()->getAdapter()->getPathPrefix();
        \File::deleteDirectory($dir, true);

        $this->allGenres = Genre::all();
        $self = $this;
        Model::reguard();
        factory(Video::class, 2)
            ->make()
            ->each(function (Video $video) use ($self) {
                $self->fetchRelations();
                Video::create(
                    array_merge(
                        $video->toArray(),
                        [
                            'thumb_file' => $self->getImageFile(),
                            'banner_file' => $self->getImageFile(),
                            'trailer_file' => $self->getVideoFile(),
                            'video_file' => $self->getVideoFile(),
                        ],
                        $this->relations
                    )
                );
            });
        Model::unguard();
    }

    private function fetchRelations()
    {
        $subGenres = $this->allGenres->random(5)->load('categories');
        $categoriesId = [];
        foreach ($subGenres as $genre) {
            array_push($categoriesId, ...$genre->categories->pluck('id')->toArray());
        }
        $categoriesId = array_unique($categoriesId);
        $genresId = $subGenres->pluck('id')->toArray();
        $this->relations['categories_id'] = $categoriesId;
        $this->relations['genres_id'] = $genresId;
    }

    private function getImageFile()
    {
        return new UploadedFile(
            storage_path('faker/thumbs/Laravel Framework.png'),
            'Laravel Framework.png'
        );
    }

    private function getVideoFile()
    {
        return new UploadedFile(
            storage_path('faker/videos/01-Como vai funcionar os uploads.mp4'),
            '01-Como vai funcionar os uploads.mp4'
        );
    }
}
