'use client';

import { useState } from 'react';
import Image from 'next/image';

const projects = {
  current: [
    { name: 'Phase 2 Infrastructure', progress: '65%', image: '/images/project1.jpg' },
    { name: 'Community Clubhouse', progress: '30%', image: '/images/project2.jpg' },
  ],
  completed: [
    { name: 'Phase 1 Roads & Lighting', year: '2024', image: '/images/project3.jpg' },
    { name: 'Borehole Installation', year: '2023', image: '/images/property1.jpg' },
  ],
};

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<'current' | 'completed'>('current');

  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-primary mb-8 text-center">Our Projects</h1>

      <div className="flex justify-center gap-4 mb-8">
        <button
          onClick={() => setActiveTab('current')}
          className={`px-6 py-2 rounded-lg transition ${
            activeTab === 'current' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Current Developments
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-2 rounded-lg transition ${
            activeTab === 'completed' ? 'bg-primary text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          Completed Projects
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {activeTab === 'current'
          ? projects.current.map((project) => (
              <div key={project.name} className="bg-white rounded-lg shadow-md p-6">
                <div className="relative h-48 w-full">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <h2 className="text-xl font-bold">{project.name}</h2>
                <div className="mt-2 bg-gray-200 rounded-full h-2.5">
                  <div className="bg-primary h-2.5 rounded-full" style={{ width: project.progress }}></div>
                </div>
                <p className="mt-2 text-gray-600">Progress: {project.progress}</p>
              </div>
            ))
          : projects.completed.map((project) => (
              <div key={project.name} className="bg-white rounded-lg shadow-md p-6">
                <div className="relative h-48 w-full">
                  <Image
                    src={project.image}
                    alt={project.name}
                    fill
                    className="object-cover rounded"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
                <h2 className="text-xl font-bold">{project.name}</h2>
                <p className="text-gray-600">Completed in {project.year}</p>
              </div>
            ))}
      </div>
    </main>
  );
}