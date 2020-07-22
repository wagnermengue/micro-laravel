<?php

namespace Tests\Feature\Models\Video;

use App\Models\Video;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;

abstract class BaseVideoTestCase extends TestCase
{
    use DatabaseMigrations;

    protected $data;

    protected function setUp(): void
    {
        parent::setUp();
        $this->data = [
            'title' => 'title_test_data',
            'description' => 'title_test_data',
            'year_launched' => 2020,
            'rating' => Video::RATING_LIST[0],
            'duration' => 94
        ];
    }
}
