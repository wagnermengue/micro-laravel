<?php

namespace Tests\Feature\Http\Controllers\Api;

use App\Http\Resources\CastMemberResource;
use App\Models\CastMember;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Tests\TestCase;
use Tests\Traits\TestResources;
use Tests\Traits\TestSaves;
use Tests\Traits\TestValidations;

class CastMemberControllerTest extends TestCase
{
    use DatabaseMigrations, TestValidations, TestSaves, TestResources;

    /**
     * @var \App\Models\CastMember
     */
    private $cast_member;

    private $fieldsSerialized = [
        'id',
        'name',
        'type',
        'created_at',
        'updated_at',
        'deleted_at',
    ];

    protected function setUp(): void
    {
        parent::setUp();
        $this->cast_member = factory(CastMember::class)->create([
            'type' => CastMember::TYPE_DIRECTOR
        ]);
    }

    public function testIndex()
    {
        $response = $this->get(route('cast_members.index'));

        $response
            ->assertStatus(200)
            ->assertJsonFragment($this->cast_member->toArray())
            ->assertJsonStructure(['data' => [
                '*' => $this->fieldsSerialized
            ]]);
    }

    public function testShow()
    {
        $cast_member = factory(CastMember::class)->create();
        $response = $this->get(route('cast_members.show', ['cast_member' => $cast_member->id]));

        $response
            ->assertStatus(200)
            ->assertJsonFragment($cast_member->toArray())
            ->assertJsonStructure(['data' => $this->fieldsSerialized]);
    }

    public function testInvalidateData()
    {
        $data = ['name' => '', 'type' => ''];
        $this->assertInvalidationInStoreAction($data, 'required');
        $this->assertInvalidationInUpdateAction($data, 'required');

        $data = ['name' => str_repeat('a', 256)];
        $this->assertInvalidationInStoreAction($data, 'max.string', ['max' => 255]);
        $this->assertInvalidationInUpdateAction($data, 'max.string', ['max' => 255]);

        $data = ['type' => 's'];
        $this->assertInvalidationInStoreAction($data, 'in');
        $this->assertInvalidationInUpdateAction($data, 'in');
    }

    public function testStore()
    {
        $data = [
            [
                'name' => 'test',
                'type' => CastMember::TYPE_DIRECTOR
            ],
            [
                'name' => 'test',
                'type' => CastMember::TYPE_ACTOR
            ]
        ];
        foreach ($data as $key => $value) {
            $response = $this->assertStore($value, $value + ['deleted_at' => null]);
            $response->assertJsonStructure(['data' => $this->fieldsSerialized]);
            $this->assertResource($response, new CastMemberResource(
                CastMember::find($response->json('data.id'))
            ));
        }
    }

    public function testUpdate()
    {
        $data = [
            'name' => 'new_name',
            'type' => CastMember::TYPE_ACTOR
        ];
        $response = $this->assertUpdate($data, $data + ['deleted_at' => null]);
        $response->assertJsonStructure(['data' => $this->fieldsSerialized]);
        $this->assertResource($response, new CastMemberResource(
            CastMember::find($response->json('data.id'))
        ));
    }

    public function testDestroy()
    {
        $cast_member = factory(CastMember::class)->create();
        $response = $this->json('DELETE', route('cast_members.destroy', [
            'cast_member' => $cast_member->id
        ]));
        $response->assertStatus(204);
        $this->assertNull(CastMember::find($cast_member->id));
        $this->assertNotNull(CastMember::withTrashed()->find($cast_member->id));
    }

    protected function model()
    {
        return CastMember::class;
    }

    protected function routeStore()
    {
        return route('cast_members.store');
    }

    protected function routeUpdate()
    {
        return route('cast_members.update', ['cast_member' => $this->cast_member->id]);
    }
}
