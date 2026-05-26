'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

type Phase = {
  id: string;
  name: string;
  status: string;
  sortOrder: number;
};

type House = {
  id: string;
  phaseId: string;
  title: string;
  price: string;
  beds: number;
  isActive: boolean;
};

export default function AdminPropertiesPage() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [activePhase, setActivePhase] = useState<string>('');

  const load = () => {
    fetch('/api/admin/properties')
      .then((r) => r.json())
      .then((d) => {
        setPhases(d.phases || []);
        setHouses(d.houses || []);
        if (!activePhase && d.phases?.[0]) setActivePhase(d.phases[0].id);
      });
  };

  useEffect(load, [activePhase]);

  const toggleHouse = async (house: House) => {
    await fetch('/api/admin/properties', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'house',
        id: house.id,
        data: { isActive: !house.isActive },
      }),
    });
    toast.success('House updated');
    load();
  };

  const phaseHouses = houses.filter((h) => h.phaseId === activePhase);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Properties & Phases</h1>
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Phases</h2>
          <div className="space-y-2">
            {phases.map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhase(phase.id)}
                className={`w-full text-left px-3 py-2 rounded text-sm ${
                  activePhase === phase.id ? 'bg-[#4169E1] text-white' : 'hover:bg-gray-100'
                }`}
              >
                {phase.name}
              </button>
            ))}
          </div>
        </div>
        <div className="lg:col-span-3 bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">House</th>
                <th className="px-4 py-3 text-left">Beds</th>
                <th className="px-4 py-3 text-left">Price</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {phaseHouses.map((house) => (
                <tr key={house.id} className="border-t">
                  <td className="px-4 py-3">{house.title}</td>
                  <td className="px-4 py-3">{house.beds}</td>
                  <td className="px-4 py-3">{house.price}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggleHouse(house)}
                      className={`text-xs px-2 py-1 rounded ${house.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}
                    >
                      {house.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
