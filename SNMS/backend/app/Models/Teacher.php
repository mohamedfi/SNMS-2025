<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Teacher extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'employee_id',
        'date_of_birth',
        'gender',
        'hire_date',
        'status',
        'qualification',
        'years_of_experience',
        'specialization',
        'certifications',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'emergency_contact_relation',
        'employment_type',
        'salary',
        'class_assigned',
        'notes',
        'photo_url',
    ];

    protected $casts = [
        'date_of_birth' => 'date',
        'hire_date' => 'date',
        'salary' => 'decimal:2',
        'years_of_experience' => 'integer',
    ];

    protected $hidden = [
        'salary',
    ];

    /**
     * Get the teacher's full name.
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get the teacher's age.
     */
    public function getAgeAttribute(): int
    {
        return $this->date_of_birth->age;
    }
}
