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
                'description' => 'Annual sports competition for all grades',
                'event_date' => '2025-12-15',
                'start_time' => '09:00',
                'end_time' => '14:00',
                'location' => 'School Playground',
                'type' => 'sports',
                'status' => 'scheduled',
            ],
            [
                'title' => 'Parent-Teacher Meeting',
                'description' => 'First semester parent-teacher conference',
                'event_date' => '2025-12-10',
                'start_time' => '10:00',
                'end_time' => '13:00',
                'location' => 'Main Hall',
                'type' => 'parent_meeting',
                'status' => 'scheduled',
            ],
            [
                'title' => 'Winter Holiday',
                'description' => 'School closed for winter break',
                'event_date' => '2025-12-20',
                'start_time' => null,
                'end_time' => null,
                'location' => null,
                'type' => 'holiday',
                'status' => 'scheduled',
            ],
            [
                'title' => 'Science Fair',
                'description' => 'Student science projects exhibition',
                'event_date' => '2025-11-25',
                'start_time' => '10:00',
                'end_time' => '15:00',
                'location' => 'Science Lab',
                'type' => 'academic',
                'status' => 'completed',
            ],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }

        echo "Events seeded successfully!\n";
    }
}
