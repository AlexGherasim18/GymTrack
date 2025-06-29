'use client';

import { useEffect, useState } from "react";

export default function Workouts() {
    const [workouts, setWorkouts] = useState<any[] | undefined>([]);

    useEffect(() => {
      const fetchWorkouts = async () => {
      const res = await fetch("/api/workouts");
      const data = await res.json();
      console.log(data);
      setWorkouts(data);
    };
    fetchWorkouts();
  }, []);

    return (
        <div>Workouts page</div>
    )
}