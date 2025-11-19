<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Event;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            [
                'title' => 'Annual Sports Day',
                'description' => 'Annual sports competition for all grades with exciting activities and prizes',
                'event_date' => '2025-12-15',
                'start_time' => '09:00',
                'end_time' => '14:00',
                'location' => 'School Playground',
                'event_type' => 'sports',
                'status' => 'upcoming',
                'capacity' => 150,
                'registered_count' => 87,
                'fee' => 50.00,
                'permission_required' => true,
                'notes' => 'Students should wear sports uniforms. Lunch will be provided.',
            ],
            [
                'title' => 'Parent-Teacher Meeting',
                'description' => 'First semester parent-teacher conference to discuss student progress',
                'event_date' => '2025-12-10',
                'start_time' => '10:00',
                'end_time' => '13:00',
                'location' => 'Main Hall',
                'event_type' => 'parent_meeting',
                'status' => 'upcoming',
                'capacity' => 200,
                'registered_count' => 145,
                'fee' => 0.00,
                'permission_required' => false,
                'notes' => 'Please bring student report cards for discussion.',
            ],
            [
                'title' => 'Winter Holiday',
                'description' => 'School closed for winter break - Happy Holidays!',
                'event_date' => '2025-12-20',
                'start_time' => '00:00',
                'end_time' => '23:59',
                'location' => 'School Campus',
                'event_type' => 'holiday',
                'status' => 'upcoming',
                'capacity' => 0,
                'registered_count' => 0,
                'fee' => 0.00,
                'permission_required' => false,
                'notes' => 'School reopens on January 5th, 2026.',
            ],
            [
                'title' => 'Science Fair',
                'description' => 'Student science projects exhibition showcasing innovative experiments',
                'event_date' => '2025-11-25',
                'start_time' => '10:00',
                'end_time' => '15:00',
                'location' => 'Science Lab',
                'event_type' => 'academic',
                'status' => 'completed',
                'capacity' => 100,
                'registered_count' => 92,
                'fee' => 30.00,
                'permission_required' => true,
                'notes' => 'Winners received certificates and prizes. Great participation!',
            ],
        ];

        foreach ($events as $eventData) {
            Event::updateOrCreate(
                ['title' => $eventData['title']],
                $eventData
            );
        }

        echo "✓ Events seeded successfully!\n";
    }
}
