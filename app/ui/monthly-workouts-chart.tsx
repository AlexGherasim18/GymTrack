'use client';
import { useState, useMemo } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import { Workout } from "../lib/definitions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun','Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
interface MonthlyWorkoutsChartProps {
  allWorkouts: Workout[];
  availableYears: number[];
  defaultYear?: number;
}

export default function MonthlyWorkoutsChart({allWorkouts, availableYears, defaultYear}: MonthlyWorkoutsChartProps) {
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear || new Date().getFullYear());

  const filteredWorkoutsByYear = useMemo(() => {
    return allWorkouts.filter((workout) => {
      const workoutYear = new Date(workout.date).getFullYear();
      return workoutYear === selectedYear;
    })
  }, [allWorkouts, selectedYear]);

  const chartData = useMemo(() => {
    if(filteredWorkoutsByYear.length === 0) {
      return {
        monthLabels,
        counts: []
      }
    }

    const counts = new Array(12).fill(0);
    filteredWorkoutsByYear.forEach((workout) => {
      const month = new Date(workout.date).getMonth();
      counts[month]++;

    })
    
    return { monthLabels, counts }

  }, [filteredWorkoutsByYear])

  return (
    <section 
      className="
        workoutsPerMonth 
        w-full 
        max-w-[540px] 
        col-span-2 
        mx-auto 
        px-2 
        flex 
        flex-col 
        items-center">
      <div className="mb-3 w-full flex justify-center">
        <label className="text-[14px]">Select Year:</label>
        <select
          className="
            text-[12px] 
            ml-1 
            bg-gray-50 
            rounded-sm 
            border-1"
          value={selectedYear ?? ''}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {availableYears?.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
      <div 
        className="
          w-full 
          h-[180px] 
          sm:h-[220px] 
          md:h-[240px]">
        <Bar
          data={{
            labels: monthLabels,
            datasets: [
              {
                label: "Workouts per Month",
                data: chartData?.counts,
                backgroundColor: "#3b82f6"
              }
            ]
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </section>
  );
}