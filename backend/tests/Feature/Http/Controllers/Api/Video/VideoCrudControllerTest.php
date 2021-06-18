<?php

namespace Tests\Feature\Http\Controllers\Api\Video;

use App\Http\Resources\VideoResource;
use App\Models\Category;
use App\Models\Genre;
use App\Models\Video;
use Illuminate\Support\Arr;
use Tests\Traits\TestResources;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class VideoCrudControllerTest extends BasicVideoControllerTestCase
{
    use TestValidations, TestSaves, TestResources;

    private $serializedFields = [
        'id',
        'title',
        'description',
        'year_launched',
        'opened',
        'rating',
        'duration',
        'video_file',
        'thumb_file',
        'banner_file',
        'trailer_file',
        'video_file_url',
        'thumb_file_url',
        'banner_file_url',
        'trailer_file_url',
        'categories' => [
            '*' => [
                'id',
                'name',
                'description',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at',
            ]
        ],
        'genres' => [
            '*' => [
                'id',
                'name',
                'is_active',
                'created_at',
                'updated_at',
                'deleted_at',
            ]
        ]
    ];

    public function testIndex()
    {
        $response = $this->get(route('videos.index'));

        $response
            ->assertStatus(200)
            ->assertJson([
                'meta' => ['per_page' => 15]
            ])
            ->assertJsonStructure([
                'data' => [
                    '*' => $this->serializedFields
                ],
                'links' => [],
                'meta' => [],
            ]);

        $this->assertResource($response, VideoResource::collection(collect([$this->video])));
        $this->assertIfFilesUrlsExists($this->video, $response);
    }

    public function testShow()
    {
        $response = $this->get(route('videos.show', ['video' => $this->video->id]));

        $response
            ->assertStatus(200)
            ->assertJsonStructure(['data' => $this->serializedFields])
            ->assertJsonFragment($this->video->toArray());

        $this->assertResource($response, new VideoResource(Video::find($response->json('data.id'))));
        $this->assertIfFilesUrlsExists($this->video, $response);
    }

    public function testInvalidateRequired()
    {
        $data = [
            'title' => '',
            'description' => '',
            'year_launched' => '',
            'rating' => '',
            'duration' => '',
            'categories_id' => '',
            'genres_id' => '',
        ];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');
    }

    public function testInvalidateMax()
    {
        $data = ['title' => str_repeat('a', 256)];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);
    }

    public function testInvalidateInteger()
    {
        $data = ['duration' => 's'];
        $this->assertInvalidationInStoreAction($data, 'integer');
        $this->assertInvalidationInUpdateAction($data, 'integer');
    }

    public function testInvalidateYearLaunchedField()
    {
        $data = ['year_launched' => 's'];
        $this->assertInvalidationInStoreAction($data, 'date_format', ['format' => 'Y']);
        $this->assertInvalidationInUpdateAction($data, 'date_format', ['format' => 'Y']);
    }

    public function testInvalidateBoolean()
    {
        $data = ['opened' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'boolean');
        $this->assertInvalidationInUpdateAction($data, 'boolean');
    }

    public function testInvalidateRatingField()
    {
        $data = ['rating' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'in');
        $this->assertInvalidationInUpdateAction($data, 'in');
    }

    public function testInvalidateCategoriesIdField()
    {
        $data = ['categories_id' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = ['categories_id' => [100]];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $category = factory(Category::class)->create();
        $category->delete();
        $data = ['categories_id' => [$category->id]];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');
    }

    public function testInvalidateGenresIdField()
    {
        $data = ['genres_id' => 'a'];
        $this->assertInvalidationInStoreAction($data, 'array');
        $this->assertInvalidationInUpdateAction($data, 'array');

        $data = ['genres_id' => [100]];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');

        $genre = factory(Genre::class)->create();
        $genre->delete();
        $data = ['genres_id' => [$genre->id]];
        $this->assertInvalidationInStoreAction($data, 'exists');
        $this->assertInvalidationInUpdateAction($data, 'exists');
    }

    public function testSaveWithoutFile()
    {
        $testData = Arr::except($this->sendData, ['categories_id', 'genres_id', 'cast_members_id']);
        $data = [
            [
                'send_data' => $this->sendData,
                'test_data' => $testData + ['opened' => false]
            ],
            [
                'send_data' => $this->sendData + [
                        'opened' => true,
                    ],
                'test_data' => $testData + ['opened' => true]
            ],
            [
                'send_data' => $this->sendData + [
                        'rating' => Video::RATING_LIST[1],
                    ],
                'test_data' => $testData + ['rating' => Video::RATING_LIST[1]]
            ]
        ];

        foreach ($data as $key => $value) {
            $response = $this->assertStore(
                $value['send_data'],
                $value['test_data'] + ['deleted_at' => null]
            );

            $this->assertHasCategory($response->json('data.id'), $value['send_data']['categories_id'][0]);
            $this->assertHasGenre($response->json('data.id'), $value['send_data']['genres_id'][0]);

            $response->assertJsonStructure(['data' => $this->serializedFields]);
            $this->assertResource($response, new VideoResource(Video::find($response->json('data.id'))));
            $this->assertIfFilesUrlsExists($this->video, $response);

            $response = $this->assertUpdate(
                $value['send_data'],
                $value['test_data'] + ['deleted_at' => null]
            );

            $this->assertHasCategory($response->json('data.id'), $value['send_data']['categories_id'][0]);
            $this->assertHasGenre($response->json('data.id'), $value['send_data']['genres_id'][0]);

            $response->assertJsonStructure(['data' => $this->serializedFields]);
            $this->assertResource($response, new VideoResource(Video::find($response->json('data.id'))));
            $this->assertIfFilesUrlsExists($this->video, $response);
        }
    }

    protected function assertHasCategory($videoId, $categoryId)
    {
        $this->assertDatabaseHas('category_video', [
            'category_id' => $categoryId,
            'video_id' => $videoId,
        ]);
    }

    protected function assertHasGenre($videoId, $genreId)
    {
        $this->assertDatabaseHas('genre_video', [
            'genre_id' => $genreId,
            'video_id' => $videoId,
        ]);
    }

    // teste movido para o model, mas deixado como exemplo
//    public function testRollbackStore()
//    {
//        $controller = \Mockery::mock(VideoController::class)
//            ->makePartial()
//            ->shouldAllowMockingProtectedMethods();
//
//        $controller
//            ->shouldReceive('validate')
//            ->withAnyArgs()
//            ->andReturn($this->sendData);
//
//        $controller
//            ->shouldReceive('rulesStore')
//            ->withAnyArgs()
//            ->andReturn([]);
//
//        $controller
//            ->shouldReceive('handleRelations')
//            ->once()
//            ->andThrow(new TestException());
//
//        $request = \Mockery::mock(Request::class);
//        $request->shouldReceive('get')
//            ->withAnyArgs()
//            ->andReturnNull();
//
//        $hasError = false;
//        try {
//            $controller->store($request);
//        } catch (TestException $exception) {
//            $this->assertCount(1, Video::all());
//            $hasError = true;
//        }
//        $this->assertTrue($hasError);
//    }
//
//    public function testRollbackUpdate()
//    {
//        $controller = \Mockery::mock(VideoController::class)
//            ->makePartial()
//            ->shouldAllowMockingProtectedMethods();
//
//        $controller
//            ->shouldReceive('findOrFail')
//            ->withAnyArgs()
//            ->andReturn($this->video);
//
//        $controller
//            ->shouldReceive('validate')
//            ->withAnyArgs()
//            ->andReturn(['name' => 'mock']);
//
//        $controller
//            ->shouldReceive('rulesUpdate')
//            ->withAnyArgs()
//            ->andReturn([]);
//
//        $controller
//            ->shouldReceive('handleRelations')
//            ->once()
//            ->andThrow(new TestException());
//
//        $request = \Mockery::mock(Request::class);
//        $request->shouldReceive('get')
//            ->withAnyArgs()
//            ->andReturnNull();
//
//        $hasError = false;
//        try {
//            $controller->update($request, 1);
//        } catch (TestException $exception) {
//            $this->assertCount(1, Video::all());
//            $hasError = true;
//        }
//        $this->assertTrue($hasError);
//    }

//    public function testSyncCategories()
//    {
//        $categoriesId = factory(Category::class, 3)->create()->pluck('id')->toArray();
//        $genre = factory(Genre::class)->create();
//        $genre->categories()->sync($categoriesId);
//        $response = $this->json(
//            'POST',
//            $this->routeStore(),
//            $this->sendData + [
//                'categories_id' => [$categoriesId[0]],
//                'genres_id' => [$genre->id],
//            ]
//        );
//        $this->assertDatabaseHas('category_video', [
//            'category_id' => $categoriesId[0],
//            'video_id' => $response->json('id'),
//        ]);
//
//        $response = $this->json(
//            'PUT',
//            route('videos.update', ['video' => $response->json('id')]),
//            $this->sendData + [
//                'categories_id' => [$categoriesId[1], $categoriesId[2]],
//                'genres_id' => [$genre->id],
//            ]
//        );
//        $this->assertDatabaseMissing('category_video', [
//            'category_id' => $categoriesId[0],
//            'video_id' => $response->json('id'),
//        ]);
//        $this->assertDatabaseHas('category_video', [
//            'category_id' => $categoriesId[1],
//            'video_id' => $response->json('id'),
//        ]);
//        $this->assertDatabaseHas('category_video', [
//            'category_id' => $categoriesId[2],
//            'video_id' => $response->json('id'),
//        ]);
//    }
//
//    public function testSyncGenres()
//    {
//        $genres = factory(Genre::class, 3)->create();
//        $genresId = $genres->pluck('id')->toArray();
//        $categoryId = factory(Category::class)->create()->id;
//
//        /** @var Collection $genres */
//        $genres->each(function ($genres) use ($categoryId) {
//            $genres->categories()->sync($categoryId);
//        });
//
//        $response = $this->json(
//            'POST',
//            $this->routeStore(),
//            $this->sendData + [
//                'categories_id' => [$categoryId],
//                'genres_id' => [$genresId[0]],
//            ]
//        );
//        $this->assertDatabaseHas('genre_video', [
//            'genre_id' => $genresId[0],
//            'video_id' => $response->json('id'),
//        ]);
//
//        $response = $this->json(
//            'PUT',
//            route('videos.update', ['video' => $response->json('id')]),
//            $this->sendData + [
//                'genres_id' => [$genresId[1], $genresId[2]],
//                'categories_id' => [$categoryId],
//            ]
//        );
//        $this->assertDatabaseMissing('genre_video', [
//            'genre_id' => $genresId[0],
//            'video_id' => $response->json('id'),
//        ]);
//        $this->assertDatabaseHas('genre_video', [
//            'genre_id' => $genresId[1],
//            'video_id' => $response->json('id'),
//        ]);
//        $this->assertDatabaseHas('genre_video', [
//            'genre_id' => $genresId[2],
//            'video_id' => $response->json('id'),
//        ]);
//    }

    public function testDestroy()
    {
        $response = $this->json('DELETE', route('videos.destroy', [
            'video' => $this->video->id
        ]));
        $response->assertStatus(204);
        $this->assertNull(Video::find($this->video->id));
        $this->assertNotNull(Video::withTrashed()->find($this->video->id));
    }

    protected function routeStore()
    {
        return route('videos.store');
    }

    protected function routeUpdate()
    {
        return route('videos.update', ['video' => $this->video->id]);
    }

    protected function model()
    {
        return Video::class;
    }
}
