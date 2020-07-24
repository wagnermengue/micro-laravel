<?php

namespace Tests\Traits;

trait TestProduction
{
    protected function skipTestIfNotProduction(string $message = '')
    {
        if (! $this->isTestProduction()) {
            $this->markTestSkipped($message);
        }
    }

    protected function isTestProduction() : bool
    {
        return env('TESTING_PROD') !== false;
    }
}
