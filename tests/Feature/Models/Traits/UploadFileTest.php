<?php

namespace Tests\Feature\Models\Traits;

use Illuminate\Http\UploadedFile;
use PHPUnit\Framework\TestCase;
use Tests\Stubs\Models\Traits\UploadFileStub;

class UploadFileTest extends TestCase
{
    /**
     * @var UploadFileStub
     */
    private $obj;

    protected function setUp(): void
    {
        parent::setUp();
        $this->obj = new UploadFileStub();
        UploadFileStub::dropTable();
        UploadFileStub::makeTable();
    }

    public function testMakeOldFilesOnSaving()
    {
        $this->obj->fill([
            'name' => 'test',
            'file1' => 'abc1.mp4',
            'file2' => 'abc2.mp4',
        ]);
        $this->obj->save();

        $this->assertCount(0, $this->obj->oldFiles);

        $this->obj->update([
            'name' => 'new_name_test',
            'file2' => 'xyz.mp4',
        ]);

        $this->assertEqualsCanonicalizing(['file2' => 'abc2.mp4'], $this->obj->oldFiles);
    }

    public function testMakeOldFilesNullOnSaving()
    {
        $this->obj->fill([
            'name' => 'test'
        ]);
        $this->obj->save();

        $this->assertCount(0, $this->obj->oldFiles);

        $this->obj->update([
            'name' => 'new_name_test',
            'file2' => 'xyz.mp4',
        ]);

        $this->assertEqualsCanonicalizing([], $this->obj->oldFiles);
    }
}
