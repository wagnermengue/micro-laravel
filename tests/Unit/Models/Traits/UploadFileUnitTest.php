<?php

namespace Tests\Unit\Models;

use Illuminate\Http\UploadedFile;
use PHPUnit\Framework\TestCase;
use Tests\Stubs\Models\Traits\UploadFileStub;

class UploadFileUnitTest extends TestCase
{
    /**
     * @var UploadFileStub
     */
    private $obj;

    protected function setUp(): void
    {
        parent::setUp();
        $this->obj = new UploadFileStub();
    }

    public function testUploadFile()
    {
        \Storage::fake();
        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        \Storage::assertExists("1/{$file->hashName()}");
    }

    public function testUploadFiles()
    {
        \Storage::fake();
        $fileX = UploadedFile::fake()->create('videoX.mp4');
        $fileY = UploadedFile::fake()->create('videoY.mp4');
        $this->obj->uploadFiles([$fileX, $fileY]);
        \Storage::assertExists("1/{$fileX->hashName()}");
        \Storage::assertExists("1/{$fileY->hashName()}");
    }
}
