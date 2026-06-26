import { useEffect, useState } from 'react';
import API from '../api/axios';
import TempleCard from '../components/TempleCard';

const Browse = () => {
  const [temples, setTemples] = useState([]);
  const [states, setStates] = useState([]);
  const [deities, setDeities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ state_id: '', deity_id: '', search: '' });

  useEffect(() => {
    API.get('/locations/states').then(res => setStates(res.data));
    API.get('/locations/deities').then(res => setDeities(res.data));
    fetchTemples();
  }, []);

  const fetchTemples = (params = {}) => {
    setLoading(true);
    API.get('/temples', { params })
      .then(res => setTemples(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleFilter = (e) => {
    const updated = { ...filters, [e.target.name]: e.target.value };
    setFilters(updated);
    fetchTemples(updated);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-orange-900 mb-6">Browse Temples</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-8">
        <input
          type="text"
          name="search"
          placeholder="Search by name..."
          value={filters.search}
          onChange={handleFilter}
          className="border border-orange-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <select
          name="state_id"
          value={filters.state_id}
          onChange={handleFilter}
          className="border border-orange-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All States</option>
          {states.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select
          name="deity_id"
          value={filters.deity_id}
          onChange={handleFilter}
          className="border border-orange-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          <option value="">All Deities</option>
          {deities.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </div>

      {/* Temple Grid */}
      {loading ? (
        <p className="text-gray-500">Loading temples...</p>
      ) : temples.length === 0 ? (
        <p className="text-gray-500">No temples found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {temples.map(temple => (
            <TempleCard key={temple.id} temple={temple} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Browse;