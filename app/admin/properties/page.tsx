'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import { hasPermission } from '@/lib/roles';

type Phase = {
  id: string;
  name: string;
  description: string;
  image: string;
  features: string[];
  status: string;
  sortOrder: number;
};

type House = {
  id: string;
  phaseId: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  images: string[];
  beds: number;
  baths: number;
  size: number;
  price: string;
  features: string[];
  isActive: boolean;
};

const emptyPhase: Omit<Phase, 'id'> = {
  name: '',
  description: '',
  image: '/images/hero1.jpg',
  features: [],
  status: 'active',
  sortOrder: 0,
};

const emptyHouse: Omit<House, 'id' | 'phaseId'> = {
  title: '',
  description: '',
  fullDescription: '',
  image: '/images/hero1.jpg',
  images: [],
  beds: 3,
  baths: 2,
  size: 120,
  price: '',
  features: [],
  isActive: true,
};

function linesToArray(text: string) {
  return text
    .split('\n')
    .map((s) => s.trim())
    .filter(Boolean);
}

function arrayToLines(arr: string[] | null | undefined) {
  return (arr || []).join('\n');
}

export default function AdminPropertiesPage() {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [activePhase, setActivePhase] = useState('');
  const [userRole, setUserRole] = useState('admin');
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const [editingHouse, setEditingHouse] = useState<House | null>(null);
  const [creatingPhase, setCreatingPhase] = useState(false);
  const [creatingHouse, setCreatingHouse] = useState(false);
  const [phaseForm, setPhaseForm] = useState(emptyPhase);
  const [houseForm, setHouseForm] = useState(emptyHouse);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);

  const canWrite = hasPermission(userRole, 'write');

  const load = () => {
    fetch('/api/admin/properties')
      .then((r) => r.json())
      .then((d) => {
        setPhases(d.phases || []);
        setHouses(d.houses || []);
        if (!activePhase && d.phases?.[0]) setActivePhase(d.phases[0].id);
      });
  };

  useEffect(() => {
    load();
    fetch('/api/auth')
      .then((r) => r.json())
      .then((d) => setUserRole(d.user?.role || 'admin'));
    fetch('/api/admin/media')
      .then((r) => r.json())
      .then((d) => setMediaUrls((d.media || []).map((m: { secureUrl: string }) => m.secureUrl).slice(0, 20)))
      .catch(() => {});
  }, []);

  const savePhase = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingPhase?.id || phaseForm.name.toLowerCase().replace(/\s+/g, '_').slice(0, 40) || `phase_${Date.now()}`;
    const data = {
      id,
      name: phaseForm.name,
      description: phaseForm.description,
      image: phaseForm.image,
      features: phaseForm.features,
      status: phaseForm.status,
      sortOrder: Number(phaseForm.sortOrder) || 0,
    };

    const res = await fetch('/api/admin/properties', {
      method: editingPhase ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'phase',
        id: editingPhase?.id,
        data,
      }),
    });

    if (res.ok) {
      toast.success(editingPhase ? 'Phase updated' : 'Phase created');
      setEditingPhase(null);
      setCreatingPhase(false);
      setPhaseForm(emptyPhase);
      load();
    } else {
      toast.error('Failed to save phase');
    }
  };

  const saveHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePhase) return;

    const id =
      editingHouse?.id ||
      `${activePhase}-house-${Date.now().toString().slice(-6)}`;

    const data = {
      id,
      phaseId: activePhase,
      title: houseForm.title,
      description: houseForm.description,
      fullDescription: houseForm.fullDescription || houseForm.description,
      image: houseForm.image,
      images: houseForm.images,
      beds: Number(houseForm.beds),
      baths: Number(houseForm.baths),
      size: Number(houseForm.size),
      price: houseForm.price,
      features: houseForm.features,
      isActive: houseForm.isActive,
    };

    const res = await fetch('/api/admin/properties', {
      method: editingHouse ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'house',
        id: editingHouse?.id,
        data,
      }),
    });

    if (res.ok) {
      toast.success(editingHouse ? 'House updated' : 'House created');
      setEditingHouse(null);
      setCreatingHouse(false);
      setHouseForm(emptyHouse);
      load();
    } else {
      toast.error('Failed to save house');
    }
  };

  const deletePhase = async (id: string) => {
    if (!confirm('Delete this phase and all its houses?')) return;
    await fetch(`/api/admin/properties?type=phase&id=${id}`, { method: 'DELETE' });
    toast.success('Phase deleted');
    load();
  };

  const deleteHouse = async (id: string) => {
    if (!confirm('Delete this house?')) return;
    await fetch(`/api/admin/properties?type=house&id=${id}`, { method: 'DELETE' });
    toast.success('House deleted');
    load();
  };

  const openEditPhase = (phase: Phase) => {
    setEditingPhase(phase);
    setCreatingPhase(false);
    setPhaseForm({
      name: phase.name,
      description: phase.description,
      image: phase.image,
      features: phase.features,
      status: phase.status,
      sortOrder: phase.sortOrder,
    });
  };

  const openEditHouse = (house: House) => {
    setEditingHouse(house);
    setCreatingHouse(false);
    setHouseForm({
      title: house.title,
      description: house.description,
      fullDescription: house.fullDescription,
      image: house.image,
      images: house.images || [],
      beds: house.beds,
      baths: house.baths,
      size: house.size,
      price: house.price,
      features: house.features || [],
      isActive: house.isActive,
    });
  };

  const phaseHouses = houses.filter((h) => h.phaseId === activePhase);
  const activePhaseData = phases.find((p) => p.id === activePhase);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Properties & Phases</h1>
          <p className="text-gray-600 text-sm">Edit prices, images, descriptions, and availability.</p>
        </div>
        {canWrite && (
          <button
            onClick={() => {
              setCreatingPhase(true);
              setEditingPhase(null);
              setPhaseForm(emptyPhase);
            }}
            className="inline-flex items-center gap-2 bg-[#4169E1] text-white px-4 py-2 rounded-md text-sm"
          >
            <Plus size={16} /> New Phase
          </button>
        )}
      </div>

      {(creatingPhase || editingPhase) && canWrite && (
        <form onSubmit={savePhase} className="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-4">
          <h2 className="md:col-span-2 font-semibold">{editingPhase ? 'Edit Phase' : 'New Phase'}</h2>
          <input
            required
            className="border rounded px-3 py-2"
            placeholder="Phase name *"
            value={phaseForm.name}
            onChange={(e) => setPhaseForm({ ...phaseForm, name: e.target.value })}
          />
          <select
            className="border rounded px-3 py-2"
            value={phaseForm.status}
            onChange={(e) => setPhaseForm({ ...phaseForm, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="under_construction">Under Construction</option>
          </select>
          <textarea
            required
            className="border rounded px-3 py-2 md:col-span-2"
            placeholder="Description *"
            rows={3}
            value={phaseForm.description}
            onChange={(e) => setPhaseForm({ ...phaseForm, description: e.target.value })}
          />
          <input
            required
            className="border rounded px-3 py-2 md:col-span-2"
            placeholder="Cover image URL *"
            value={phaseForm.image}
            onChange={(e) => setPhaseForm({ ...phaseForm, image: e.target.value })}
          />
          <textarea
            className="border rounded px-3 py-2 md:col-span-2"
            placeholder="Features (one per line)"
            rows={3}
            value={arrayToLines(phaseForm.features)}
            onChange={(e) => setPhaseForm({ ...phaseForm, features: linesToArray(e.target.value) })}
          />
          <input
            type="number"
            className="border rounded px-3 py-2"
            placeholder="Sort order"
            value={phaseForm.sortOrder}
            onChange={(e) => setPhaseForm({ ...phaseForm, sortOrder: Number(e.target.value) })}
          />
          <div className="md:col-span-2 flex gap-2">
            <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-md text-sm">Save Phase</button>
            <button
              type="button"
              onClick={() => {
                setCreatingPhase(false);
                setEditingPhase(null);
              }}
              className="border px-4 py-2 rounded-md text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="font-semibold mb-3">Phases</h2>
          <div className="space-y-2">
            {phases.map((phase) => (
              <div key={phase.id} className="flex items-center gap-1">
                <button
                  onClick={() => setActivePhase(phase.id)}
                  className={`flex-1 text-left px-3 py-2 rounded text-sm ${
                    activePhase === phase.id ? 'bg-[#4169E1] text-white' : 'hover:bg-gray-100'
                  }`}
                >
                  {phase.name}
                </button>
                {canWrite && (
                  <>
                    <button onClick={() => openEditPhase(phase)} className="p-1 text-gray-500 hover:text-blue-600">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => deletePhase(phase.id)} className="p-1 text-gray-500 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3 space-y-4">
          {activePhaseData && (
            <div className="bg-white rounded-lg shadow p-4 flex gap-4 items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={activePhaseData.image} alt="" className="w-24 h-16 object-cover rounded" />
              <div>
                <h3 className="font-semibold">{activePhaseData.name}</h3>
                <p className="text-sm text-gray-600 line-clamp-2">{activePhaseData.description}</p>
              </div>
            </div>
          )}

          {canWrite && (
            <button
              onClick={() => {
                setCreatingHouse(true);
                setEditingHouse(null);
                setHouseForm(emptyHouse);
              }}
              className="inline-flex items-center gap-2 bg-[#4169E1] text-white px-4 py-2 rounded-md text-sm"
            >
              <Plus size={16} /> Add House to Phase
            </button>
          )}

          {(creatingHouse || editingHouse) && canWrite && (
            <form onSubmit={saveHouse} className="bg-white rounded-lg shadow p-6 grid md:grid-cols-2 gap-4">
              <h2 className="md:col-span-2 font-semibold">{editingHouse ? 'Edit House' : 'New House'}</h2>
              <input
                required
                className="border rounded px-3 py-2 md:col-span-2"
                placeholder="Title *"
                value={houseForm.title}
                onChange={(e) => setHouseForm({ ...houseForm, title: e.target.value })}
              />
              <input
                required
                className="border rounded px-3 py-2"
                placeholder="Price * (e.g. $50,473.66)"
                value={houseForm.price}
                onChange={(e) => setHouseForm({ ...houseForm, price: e.target.value })}
              />
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={houseForm.isActive}
                  onChange={(e) => setHouseForm({ ...houseForm, isActive: e.target.checked })}
                />
                Visible on website
              </label>
              <input
                type="number"
                className="border rounded px-3 py-2"
                placeholder="Beds"
                value={houseForm.beds}
                onChange={(e) => setHouseForm({ ...houseForm, beds: Number(e.target.value) })}
              />
              <input
                type="number"
                className="border rounded px-3 py-2"
                placeholder="Baths"
                value={houseForm.baths}
                onChange={(e) => setHouseForm({ ...houseForm, baths: Number(e.target.value) })}
              />
              <input
                type="number"
                className="border rounded px-3 py-2"
                placeholder="Size (m²)"
                value={houseForm.size}
                onChange={(e) => setHouseForm({ ...houseForm, size: Number(e.target.value) })}
              />
              <input
                required
                className="border rounded px-3 py-2 md:col-span-2"
                placeholder="Main image URL *"
                value={houseForm.image}
                onChange={(e) => setHouseForm({ ...houseForm, image: e.target.value })}
              />
              {mediaUrls.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-xs text-gray-500 mb-2">Pick from media library:</p>
                  <div className="flex flex-wrap gap-2">
                    {mediaUrls.map((url) => (
                      <button
                        key={url}
                        type="button"
                        onClick={() => setHouseForm({ ...houseForm, image: url })}
                        className="border rounded overflow-hidden w-16 h-12"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <textarea
                className="border rounded px-3 py-2 md:col-span-2"
                placeholder="Extra image URLs (one per line)"
                rows={2}
                value={arrayToLines(houseForm.images)}
                onChange={(e) => setHouseForm({ ...houseForm, images: linesToArray(e.target.value) })}
              />
              <textarea
                required
                className="border rounded px-3 py-2 md:col-span-2"
                placeholder="Short description *"
                rows={2}
                value={houseForm.description}
                onChange={(e) => setHouseForm({ ...houseForm, description: e.target.value })}
              />
              <textarea
                className="border rounded px-3 py-2 md:col-span-2"
                placeholder="Full description"
                rows={4}
                value={houseForm.fullDescription}
                onChange={(e) => setHouseForm({ ...houseForm, fullDescription: e.target.value })}
              />
              <textarea
                className="border rounded px-3 py-2 md:col-span-2"
                placeholder="Features (one per line)"
                rows={3}
                value={arrayToLines(houseForm.features)}
                onChange={(e) => setHouseForm({ ...houseForm, features: linesToArray(e.target.value) })}
              />
              <div className="md:col-span-2 flex gap-2">
                <button type="submit" className="bg-green-700 text-white px-4 py-2 rounded-md text-sm">Save House</button>
                <button
                  type="button"
                  onClick={() => {
                    setCreatingHouse(false);
                    setEditingHouse(null);
                  }}
                  className="border px-4 py-2 rounded-md text-sm"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left">House</th>
                  <th className="px-4 py-3 text-left">Beds</th>
                  <th className="px-4 py-3 text-left">Price</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  {canWrite && <th className="px-4 py-3 text-left">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {phaseHouses.map((house) => (
                  <tr key={house.id} className="border-t">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={house.image} alt="" className="w-12 h-10 object-cover rounded" />
                        <span>{house.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{house.beds}</td>
                    <td className="px-4 py-3 font-medium">{house.price}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded ${house.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100'}`}>
                        {house.isActive ? 'Active' : 'Hidden'}
                      </span>
                    </td>
                    {canWrite && (
                      <td className="px-4 py-3 space-x-2">
                        <button onClick={() => openEditHouse(house)} className="text-[#4169E1] hover:underline text-xs">
                          Edit
                        </button>
                        <button onClick={() => deleteHouse(house.id)} className="text-red-600 hover:underline text-xs">
                          Delete
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
