<?php


namespace Tests\Stubs\Models\Traits;


use App\Models\Traits\UploadFiles;
use Illuminate\Database\Eloquent\Model;

class UploadFileStub extends Model
{
    use UploadFiles;

    protected function uploadDir()
    {
        return "1";
    }
}
