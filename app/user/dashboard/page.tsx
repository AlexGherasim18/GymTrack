'use client'

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { PlusIcon } from '@heroicons/react/24/outline';
import { DashboardRoutine, DashboardWorkout, Workout } from '@/app/lib/definitions';
import MonthlyWorkoutsChart from '@/app/ui/monthly-workouts-chart';

export default function UserDashboardPage() {
  const [allWorkouts, setAllWorkouts] = useState<Workout[]>([]);
  const [lastFiveRoutines, setLastFiveRoutines] = useState<DashboardRoutine[]>();
  const [lastFiveWorkouts, setLastFiveWorkouts] = useState<DashboardWorkout[]>();

  useEffect(() => {
    const fetchLastFiveRoutines = async () => {
      try {
        const res = await fetch("/api/last-five-routines");
        const data = await res.json();
        setLastFiveRoutines(data);
      } catch(error) {
        console.log(error)
      }
    };
    const fetchLastFiveWorkouts = async () => {
      try {
        const res = await fetch("/api/last-five-workouts");
        const data = await res.json();
        setLastFiveWorkouts(data);
      } catch(error) {
        console.log(error)
      }
    };
    const fetchWorkouts = async () => {
      try {
        const response = await fetch("/api/workouts");
        if(!response.ok) {
          throw new Error(`HTTP Error! Status: ${response.status}`)
        }
        const data: Workout[] = await response.json();
        setAllWorkouts(data);
        // setIsDataReady(true);
        } catch(error) {
          console.log(error);
        }
    };
    fetchLastFiveRoutines();
    fetchLastFiveWorkouts();
    fetchWorkouts();
  }, [])

  const availableYears = useMemo(() => {
    if(allWorkouts.length === 0) return [];

    const years = allWorkouts.map((workout) => new Date(workout.date).getFullYear());
    return [...new Set(years)].sort((a, b) => b - a);
  }, [allWorkouts]);
      
  const defaultYear = availableYears[0];

  return (
    <main className="w-full mt-8 flex flex-col justify-center">
      <section className="chart-section w-full">
        <MonthlyWorkoutsChart 
          allWorkouts = {allWorkouts}
          availableYears = {availableYears}
          defaultYear = {defaultYear}
        />
      </section>
      <section 
        className="
          tables-section 
          w-full 
          flex 
          items-center 
          justify-evenly
          mt-5

          max-[652px]:flex-col
          max-[652px]:justify-center
          max-[652px]:gap-5
          max-[652px]: mb-5">
        <section 
          className="
            workouts-table 
            flex 
            flex-col 
            items-center 
            justify-between 
            bg-gray-50 
            rounded-sm 
            shadow-xl 
            py-3 
            w-[250px] 
            h-[370px]
            
            max-[320px]:w-[180px]">
          <h3 className="w-full font-semibold mb-3.5 px-2 max-[320px]:text-[14px] max-[320px]:mb-1">Last Workouts Logged</h3>
          {lastFiveWorkouts ?
            (
              <ul className="wourkouts-list w-full flex flex-col justify-center">
                {lastFiveWorkouts.map(workout => (
                  <li key={workout.id} className="w-full mb-3 bg-gray-100 text-[14px] px-2">
                    <p>{workout.name}</p>
                    <p className="text-[10px]">Date: {workout.date}</p>
                  </li>
                ))}
              </ul>
            )
            : (<p className="text-[14px] p-2">Sorry, you did not log any Workout.</p>)
          }
          <Link href="/user/dashboard/create-workout" 
            className="
              max-w-[230px] 
              flex 
              flex-row 
              items-center
              justify-center
              py-6 
              px-12 
              gap-2 
              h-10   
              rounded-2xl 
              self-center 
              mt-3 
              bg-blue-500 
              hover:bg-blue-900 
              cursor-pointer 
              text-amber-50
              
              max-[320px]:px-2
              max-[320px]:py-3
              max-[320px]:gap-1
              max-[320px]:text-[10px]
              max-[320px]:w-[160px]
              max-[320px]:h-8">
            <PlusIcon className="w-5 max-[320px]:w-3" />
            <p>Log a Workout</p>
          </Link>
        </section>
        <section 
          className="
            routines-table 
            flex 
            flex-col 
            items-center 
            justify-between 
            bg-gray-50 
            rounded-sm 
            shadow-xl 
            py-3 
            w-[250px] 
            min-h-[370px]
            
            max-[320px]:w-[180px]">
          <h3 className="w-full font-semibold mb-3.5 px-2 max-[320px]:text-[14px] max-[320px]:mb-1">Last Routines Added</h3>
          {lastFiveRoutines ?
            (
              <ul className="routines-list w-full flex flex-col justify-center">
                {lastFiveRoutines.map(routine => (
                  <li key={routine.id} className="w-full mb-3 p-2 bg-gray-100 text-[14px]">
                    {routine.name}
                  </li>
                ))}
              </ul>
            )
            : (<p className="text-[14px] p-2">Sorry, you did not log any Workout.</p>)
          }
          <Link href="/user/dashboard/create-routine" 
            className="
              flex 
              flex-row 
              items-center
              justify-center 
              py-6 
              px-12 
              gap-2 
              h-10 
              rounded-2xl 
              self-center 
              mt-3 
              bg-blue-500 
              hover:bg-blue-900 
              cursor-pointer 
              text-amber-50
              
              max-[320px]:px-2
              max-[320px]:py-3
              max-[320px]:gap-1
              max-[320px]:text-[10px]
              max-[320px]:w-[160px]
              max-[320px]:h-8">
            <PlusIcon className="w-5 max-[320px]:w-3" />
            <p>Create Routine</p>
          </Link>
        </section>
      </section>
    </main>
  );
}
