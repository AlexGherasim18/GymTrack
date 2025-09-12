'use client';

import { useEffect, useState, useMemo } from "react";
import { useExercisesListStore } from "../store/exercisesStore";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Button from "./button";
import { Exercise } from "../lib/definitions";

export default function PopUp({onClose, onSelectExercise}: {onClose: () => void; onSelectExercise: (exercise: Exercise) => void}) {
    const {muscleGroups, fetchExercisesList} = useExercisesListStore();
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchExercisesList();
    }, [fetchExercisesList]);

    const filteredMuscleGroups = useMemo(() => {
    if (!searchQuery.trim()) return muscleGroups;
    
    const searchTerm = searchQuery.toLowerCase();
    
    return muscleGroups
        .map(group => {
            const groupNameMatches = group.name.toLowerCase().includes(searchTerm);
            
            if (groupNameMatches) {
                return group;
            }
            
            return {
                ...group,
                exercises: group.exercises.filter(exercise =>
                    exercise.name.toLowerCase().includes(searchTerm)
                )
            };
        })
        .filter(group => group.exercises.length > 0);
}, [muscleGroups, searchQuery]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-white rounded-2xl shadow-2xl flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <section className="header-section flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Select Exercise</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </section>

                <section className="search-bar-section sticky top-0 bg-white z-10 px-6 pb-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search exercises or muscle group..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            >
                                <XMarkIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                            </button>
                        )}
                    </div>
                </section>

                <section className="content-section flex-1 overflow-y-auto p-6">
                    <div className="space-y-8">
                        {filteredMuscleGroups.map((group) => (
                            <div key={group.id} className="space-y-4">
                                
                                <section className="sticky top-0 bg-white/90 backdrop-blur-sm py-2 -mx-6 px-6">
                                    <h3 className="text-xl font-semibold text-blue-600 border-b-2 border-blue-100 pb-2">
                                        {group.name}
                                    </h3>
                                </section>
                                
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {group.exercises.map((exercise) => (
                                        <div 
                                            key={exercise.id} 
                                            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-blue-300 transition-all duration-200 group"
                                        >
                                            {/* Exercise Image */}
                                            <div className="aspect-[4/3] overflow-hidden bg-gray-50">
                                                <img 
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" 
                                                    src={exercise.imageUrl} 
                                                    alt={exercise.name}
                                                    loading="lazy"
                                                />
                                            </div>
                                            
                                            <div className="p-4 space-y-3">
                                                <h4 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                                                    {exercise.name}
                                                </h4>
                                                
                                                <Button 
                                                    onClick={() => onSelectExercise(exercise)}
                                                    className="w-full py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                                >
                                                    Add Exercise
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {muscleGroups.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 text-lg mb-2">No exercises found</div>
                            <div className="text-gray-500 text-sm">Try refreshing or check your connection</div>
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}