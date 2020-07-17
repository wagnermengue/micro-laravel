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

    public function testDeleteFile()
    {
        \Storage::fake();
        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        $filename = $file->hashName();
        $this->obj->deleteFile($filename);
        \Storage::assertMissing("1/{$filename}");

        $file = UploadedFile::fake()->create('video.mp4');
        $this->obj->uploadFile($file);
        $this->obj->deleteFile($file);
        \Storage::assertMissing("1/{$file->hashName()}");
    }

    public function testDeletedFiles()
    {
        \Storage::fake();
        $fileX = UploadedFile::fake()->create('videoX.mp4');
        $fileY = UploadedFile::fake()->create('videoY.mp4');
        $this->obj->uploadFiles([$fileX, $fileY]);
        $this->obj->deleteFiles([$fileX->hashName(), $fileY]);
        \Storage::assertMissing("1/{$fileX->hashName()}");
        \Storage::assertMissing("1/{$fileY->hashName()}");
    }

    public function testExtractFiles()
    {
        $attributes = [];
        $files = UploadFileStub::extractFiles($attributes);
        $this->assertCount(0, $attributes);
        $this->assertCount(0, $files);

        $attributes = ['file1' => 'teste1'];
        $files = UploadFileStub::extractFiles($attributes);
        $this->assertCount(1, $attributes);
        $this->assertCount(0, $files);

        $attributes = ['file1' => 'teste1', 'file2' => 'teste2'];
        $files = UploadFileStub::extractFiles($attributes);
        $this->assertCount(2, $attributes);
        $this->assertCount(0, $files);

        $attributes = ['file1' => 'teste1', 'file2' => 'teste2'];
        $files = UploadFileStub::extractFiles($attributes);
        $this->assertCount(2, $attributes);
        $this->assertCount(0, $files);

        $file1 = UploadedFile::fake()->create('video.mp4');
        $attributes = ['file1' => $file1, 'other' => 'test'];
        $files = UploadFileStub::extractFiles($attributes);
        $this->assertCount(2, $attributes);
        $this->assertEquals(['file1' => $file1->hashName(), 'other' => 'test'], $attributes);
        $this->assertCount(1, $files);
        $this->assertEquals([$file1], $files);

        $file2 = UploadedFile::fake()->create('video2.mp4');
        $attributes = ['file1' => $file1, 'file2' => $file2, 'other' => 'test'];
        $files = UploadFileStub::extractFiles($attributes);
        $this->assertCount(3, $attributes);
        $this->assertEquals([
            'file1' => $file1->hashName(),
            'file2' => $file2->hashName(),
            'other' => 'test'
        ], $attributes);
        $this->assertCount(2, $files);
        $this->assertEquals([$file1, $file2], $files);
    }
}
