<?php


namespace Tests\Traits;


trait TestStorages
{
    protected function deleteAllFiles()
    {
        $dirs = \Storage::allDirectories();
        foreach ($dirs as $dir) {
            $files = \Storage::allFiles($dir);
            \Storage::delete($files);
            \Storage::deleteDirectory($dir);
        }
    }
}
