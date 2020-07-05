<?php

namespace Tests\Traits;

use Illuminate\Foundation\Testing\TestResponse;

trait TestSaves
{
    protected function assertStore(array $sendData, array $testDatabase, array $testJsonData = null) : TestResponse
    {
        /** @var TestResponse $response */
        $response = $this->json('POST', $this->routeStore(), $sendData);
        if ($response->status() !== 201) {
            throw new \Exception(
                "Response status must be 201, given {$response->status()}: \n{$response->getContent()}"
            );
        }
        $model = $this->model();
        $table = (new $model)->getTable();
        $this->assertDatabaseHas($table, $testDatabase + ['id' => $response->json('id')]);
        $testJsonResponse = $testJsonData ?? $testDatabase;
        $response->assertJsonFragment($testJsonResponse + ['id' => $response->json('id')]);
        return $response;
    }
}
