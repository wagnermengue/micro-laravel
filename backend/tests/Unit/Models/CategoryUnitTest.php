<?php

namespace Tests\Unit\Models;

use App\Models\Category;
use App\Traits\Uuid;
use EloquentFilter\Filterable;
use Illuminate\Database\Eloquent\SoftDeletes;
use PHPUnit\Framework\TestCase;

class CategoryUnitTest extends TestCase
{
    /**
     * @var Category
     */
    private $category;

    public static function setUpBeforeClass(): void
    {
        parent::setUpBeforeClass(); // TODO: Change the autogenerated stub
    }

    protected function setUp(): void
    {
        parent::setUp();
        $this->category = new Category();
    }

    protected function tearDown(): void
    {
        parent::tearDown(); // TODO: Change the autogenerated stub
    }

    public static function tearDownAfterClass(): void
    {
        parent::tearDownAfterClass(); // TODO: Change the autogenerated stub
    }


    public function testFillableAttribute()
    {
        $fillable = ['name', 'description', 'is_active'];
        $this->assertEquals($fillable, $this->category->getFillable());
    }

    public function testIfUseTraitsAttribute()
    {
        $traits = [
            SoftDeletes::class, Uuid::class, Filterable::class
        ];
        $categoryTraits = array_keys(class_uses(Category::class));
        $this->assertEquals($traits, $categoryTraits);
    }

    public function testCastsAttribute()
    {
        $casts = ['id' => 'string', 'is_active' => 'boolean'];
        $this->assertEquals($casts, $this->category->getCasts());
    }

    public function testIncrementingAttribute()
    {
        $this->assertFalse($this->category->incrementing);
    }

    public function testDatesAttribute()
    {
        $dates = ['deleted_at', 'updated_at', 'created_at'];
        foreach ($dates as $date) {
            $this->assertContains($date, $this->category->getDates());
        }
        $this->assertCount(count($dates), $this->category->getDates());
    }
}
