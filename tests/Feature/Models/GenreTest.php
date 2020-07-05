<?php

namespace Tests\Feature\Models;

use App\Models\Genre;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class GenreTest extends TestCase
{
    use DatabaseMigrations;

    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testList()
    {
        factory(Genre::class)->create();
        $genres = Genre::all();
        $this->assertCount(1, $genres);
        $genresKeys = array_keys($genres->first()->getAttributes());
        $attributes = [
            'id',
            'name',
            'is_active',
            'created_at',
            'updated_at',
            'deleted_at',
        ];
        $this->assertEqualsCanonicalizing($attributes, $genresKeys);
    }

    public function testCreate()
    {
        $genre = Genre::create(['name' => 'test']);
        $genre->refresh();
        $this->assertEquals(36, strlen($genre->id));
        $this->assertEquals('test', $genre->name);
        $this->assertTrue($genre->is_active);

        $genre = Genre::create([
            'name' => 'test',
            'is_active' => false,
        ]);
        $this->assertFalse($genre->is_active);

        $genre = Genre::create([
            'name' => 'test',
            'is_active' => true,
        ]);
        $this->assertTrue($genre->is_active);
    }

    public function testUpdate()
    {
        $genre = factory(Genre::class)->create(['is_active' => false]);

        $data = [
            'name' => 'new_name',
            'is_active' => true,
        ];
        $genre->update($data);

        foreach ($data as $key => $value) {
            $this->assertEquals($value, $genre->{$key});
        }
    }

    public function testDelete()
    {
        $genre = factory(Genre::class)->create();
        $genre->delete();
        $this->assertNull(Genre::find($genre->id));

        $genre->restore();
        $this->assertNotNull(Genre::find($genre->id));
    }
}
