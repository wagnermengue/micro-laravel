<?php

namespace Tests\Feature\Http\Controllers\Api\Video;

use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

abstract class BasicVideoControllerTestCase extends TestCase
{
    use DatabaseMigrations;

    /**
     * @var \App\Models\Video
     */
    protected $video;

    protected $sendData;

    protected function setUp(): void
    {
        parent::setUp();
        $this->video = factory(Video::class)->create([
            'opened' => false
        ]);
        $this->sendData = [
            'title' => 'title_test',
            'description' => 'description_test',
            'year_launched' => 2020,
            'rating' => Video::RATING_LIST[0],
            'duration' => 90,
        ];
    }
}
