import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

const defaultForm = {
  name: '', description: '', history: '',
  city_id: '', deity_id: '', image_url: '',
  is_featured: false, status: 'approved',
  visitor_info: {
    dress_code: '', rules: '', nearby_accommodation: '',
    transport_options: '', official_website: '', places_to_visit: ''
  },
  darshan_timings: [
    { day_type: 'Weekday', open_time: '', close_time: '', notes: '' }
  ],
  festivals: [
    { name: '', festival_date: '', description: '' }
  ]
};

const AdminDashboard = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editTemple, setEditTemple] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [deities, setDeities] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [activeTab, setActiveTab] = useState('basic');
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName');

  useEffect(() => {
    fetchTemples();
    API.get('/locations/states').then(res => setStates(res.data));
    API.get('/locations/deities').then(res => setDeities(res.data));
  }, []);

  const fetchTemples = () => {
    setLoading(true);
    API.get('/admin/temples', {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    })
      .then(res => setTemples(res.data))
      .catch(() => navigate('/admin/login'))
      .finally(() => setLoading(false));
  };

  const handleStateChange = (e) => {
    const state_id = e.target.value;
    setForm(f => ({ ...f, city_id: '' }));
    if (state_id) {
      API.get(`/locations/cities?state_id=${state_id}`).then(res => setCities(res.data));
    } else {
      setCities([]);
    }
  };

  const addTiming = () => setForm(f => ({
    ...f, darshan_timings: [...f.darshan_timings, { day_type: '', open_time: '', close_time: '', notes: '' }]
  }));
  const removeTiming = (i) => setForm(f => ({
    ...f, darshan_timings: f.darshan_timings.filter((_, idx) => idx !== i)
  }));
  const updateTiming = (i, field, value) => setForm(f => ({
    ...f, darshan_timings: f.darshan_timings.map((t, idx) => idx === i ? { ...t, [field]: value } : t)
  }));

  const addFestival = () => setForm(f => ({
    ...f, festivals: [...f.festivals, { name: '', festival_date: '', description: '' }]
  }));
  const removeFestival = (i) => setForm(f => ({
    ...f, festivals: f.festivals.filter((_, idx) => idx !== i)
  }));
  const updateFestival = (i, field, value) => setForm(f => ({
    ...f, festivals: f.festivals.map((fest, idx) => idx === i ? { ...fest, [field]: value } : fest)
  }));

  const handleSubmit = async () => {
    const headers = { Authorization: `Bearer ${localStorage.getItem('adminToken')}` };
    try {
      let templeId;
      if (editTemple) {
        await API.put(`/admin/temples/${editTemple.id}`, form, { headers });
        templeId = editTemple.id;
      } else {
        const res = await API.post('/admin/temples', form, { headers });
        templeId = res.data.id;
      }
      await API.post(`/admin/temples/${templeId}/timings`, { timings: form.darshan_timings }, { headers });
      await API.post(`/admin/temples/${templeId}/festivals`, { festivals: form.festivals }, { headers });
      await API.post(`/admin/temples/${templeId}/visitor-info`, form.visitor_info, { headers });

      setShowForm(false);
      setEditTemple(null);
      setForm(defaultForm);
      setActiveTab('basic');
      fetchTemples();
    } catch (err) {
      alert('Error saving temple: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = async (temple) => {
    setEditTemple(temple);
    const res = await API.get(`/temples/${temple.id}`);
    const t = res.data;

    // Pre-load cities for the state
    if (t.city_id) {
      const cityRes = await API.get(`/locations/cities?state_id=${t.city_id}`);
      setCities(cityRes.data);
    }

    setForm({
      name: t.name || '',
      description: t.description || '',
      history: t.history || '',
      city_id: t.city_id || '',
      deity_id: t.deity_id || '',
      image_url: t.image_url || '',
      is_featured: t.is_featured || false,
      status: t.status || 'approved',
      visitor_info: t.visitor_info || {
        dress_code: '', rules: '', nearby_accommodation: '',
        transport_options: '', official_website: '', places_to_visit: ''
      },
      darshan_timings: t.darshan_timings?.length > 0 ? t.darshan_timings : [{ day_type: '', open_time: '', close_time: '', notes: '' }],
      festivals: t.festivals?.length > 0 ? t.festivals : [{ name: '', festival_date: '', description: '' }]
    });
    setShowForm(true);
    setActiveTab('basic');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this temple?')) return;
    await API.delete(`/admin/temples/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('adminToken')}` }
    });
    fetchTemples();
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    navigate('/admin/login');
  };

  const tabs = ['basic', 'timings', 'festivals', 'visitor'];
  const tabLabels = { basic: '🛕 Basic Info', timings: '🕐 Darshan Timings', festivals: '🎉 Festivals', visitor: '📋 Visitor Info' };

  return (
    <div className="min-h-screen bg-orange-50">
      <div style={{ background: 'linear-gradient(135deg, #7B1F1F, #B5390A)' }}
        className="text-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🛕</span>
          <div>
            <div className="font-bold">Temple Heritage — Admin</div>
            <div className="text-xs text-orange-200">Welcome, {adminName}</div>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <a href="/" className="text-sm text-orange-200 hover:text-white transition">View Site</a>
          <button onClick={handleLogout}
            className="bg-white/20 hover:bg-white/30 text-sm px-4 py-1.5 rounded-lg transition">
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-stone-800">Manage Temples</h1>
          <button
            onClick={() => { setShowForm(true); setEditTemple(null); setForm(defaultForm); setActiveTab('basic'); }}
            className="text-white px-5 py-2.5 rounded-lg font-medium text-sm transition"
            style={{ background: 'linear-gradient(135deg, #7B1F1F, #B5390A)' }}>
            + Add Temple
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-orange-100">
            <h2 className="text-lg font-bold text-stone-800 mb-4">
              {editTemple ? 'Edit Temple' : 'Add New Temple'}
            </h2>
            <div className="flex gap-2 mb-6 border-b border-orange-100 pb-3 flex-wrap">
              {tabs.map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${activeTab === tab ? 'text-white' : 'bg-orange-50 text-stone-600 hover:bg-orange-100'}`}
                  style={activeTab === tab ? { background: 'linear-gradient(135deg, #7B1F1F, #B5390A)' } : {}}>
                  {tabLabels[tab]}
                </button>
              ))}
            </div>

            {activeTab === 'basic' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-stone-600 block mb-1">Temple Name *</label>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="e.g. Kashi Vishwanath Temple" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-600 block mb-1">Image URL</label>
                  <input value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="https://..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-600 block mb-1">State *</label>
                  <select onChange={handleStateChange}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option value="">Select State</option>
                    {states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-600 block mb-1">City *</label>
                  <select value={form.city_id} onChange={e => setForm(f => ({ ...f, city_id: e.target.value }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option value="">Select City</option>
                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-600 block mb-1">Deity *</label>
                  <select value={form.deity_id} onChange={e => setForm(f => ({ ...f, deity_id: e.target.value }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option value="">Select Deity</option>
                    {deities.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-600 block mb-1">Status</label>
                  <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-stone-600 block mb-1">Description</label>
                  <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    rows={2} placeholder="Brief description..." />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-stone-600 block mb-1">History</label>
                  <textarea value={form.history} onChange={e => setForm(f => ({ ...f, history: e.target.value }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    rows={3} placeholder="Historical background..." />
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="featured" checked={form.is_featured}
                    onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))}
                    className="w-4 h-4 accent-orange-600" />
                  <label htmlFor="featured" className="text-sm font-medium text-stone-600">Mark as Featured</label>
                </div>
              </div>
            )}

            {activeTab === 'timings' && (
              <div className="space-y-4">
                {form.darshan_timings.map((t, i) => (
                  <div key={i} className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs font-medium text-stone-500 block mb-1">Day Type</label>
                        <select value={t.day_type} onChange={e => updateTiming(i, 'day_type', e.target.value)}
                          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400">
                          <option value="Weekday">Weekday</option>
                          <option value="Weekend">Weekend</option>
                          <option value="All Days">All Days</option>
                          <option value="Festival Days">Festival Days</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stone-500 block mb-1">Opens At</label>
                        <input type="time" value={t.open_time} onChange={e => updateTiming(i, 'open_time', e.target.value)}
                          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stone-500 block mb-1">Closes At</label>
                        <input type="time" value={t.close_time} onChange={e => updateTiming(i, 'close_time', e.target.value)}
                          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stone-500 block mb-1">Notes</label>
                        <input value={t.notes} onChange={e => updateTiming(i, 'notes', e.target.value)}
                          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                          placeholder="e.g. Special aarti at 5 AM" />
                      </div>
                    </div>
                    {form.darshan_timings.length > 1 && (
                      <button onClick={() => removeTiming(i)} className="mt-2 text-red-500 text-xs hover:text-red-700">— Remove</button>
                    )}
                  </div>
                ))}
                <button onClick={addTiming} className="text-orange-600 text-sm font-medium hover:text-orange-800">+ Add another timing</button>
              </div>
            )}

            {activeTab === 'festivals' && (
              <div className="space-y-4">
                {form.festivals.map((f, i) => (
                  <div key={i} className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-medium text-stone-500 block mb-1">Festival Name</label>
                        <input value={f.name} onChange={e => updateFestival(i, 'name', e.target.value)}
                          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                          placeholder="e.g. Mahashivratri" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stone-500 block mb-1">Date</label>
                        <input type="date" value={f.festival_date} onChange={e => updateFestival(i, 'festival_date', e.target.value)}
                          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400" />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-stone-500 block mb-1">Description</label>
                        <input value={f.description} onChange={e => updateFestival(i, 'description', e.target.value)}
                          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                          placeholder="Brief description..." />
                      </div>
                    </div>
                    {form.festivals.length > 1 && (
                      <button onClick={() => removeFestival(i)} className="mt-2 text-red-500 text-xs hover:text-red-700">— Remove</button>
                    )}
                  </div>
                ))}
                <button onClick={addFestival} className="text-orange-600 text-sm font-medium hover:text-orange-800">+ Add another festival</button>
              </div>
            )}

            {activeTab === 'visitor' && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-stone-600 block mb-1">Official Website</label>
                  <input value={form.visitor_info.official_website}
                    onChange={e => setForm(f => ({ ...f, visitor_info: { ...f.visitor_info, official_website: e.target.value } }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="https://templewebsite.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-600 block mb-1">Dress Code</label>
                  <textarea value={form.visitor_info.dress_code}
                    onChange={e => setForm(f => ({ ...f, visitor_info: { ...f.visitor_info, dress_code: e.target.value } }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    rows={2} placeholder="e.g. Traditional Indian attire preferred..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-600 block mb-1">Rules & Guidelines</label>
                  <textarea value={form.visitor_info.rules}
                    onChange={e => setForm(f => ({ ...f, visitor_info: { ...f.visitor_info, rules: e.target.value } }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    rows={2} placeholder="e.g. No photography inside sanctum..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-600 block mb-1">Nearby Accommodation</label>
                  <textarea value={form.visitor_info.nearby_accommodation}
                    onChange={e => setForm(f => ({ ...f, visitor_info: { ...f.visitor_info, nearby_accommodation: e.target.value } }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    rows={2} placeholder="e.g. Multiple hotels available near the temple..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-600 block mb-1">Transport Options</label>
                  <textarea value={form.visitor_info.transport_options}
                    onChange={e => setForm(f => ({ ...f, visitor_info: { ...f.visitor_info, transport_options: e.target.value } }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    rows={2} placeholder="e.g. Auto-rickshaws available from railway station..." />
                </div>
                <div>
                  <label className="text-sm font-medium text-stone-600 block mb-1">Places to Visit Nearby</label>
                  <textarea value={form.visitor_info.places_to_visit}
                    onChange={e => setForm(f => ({ ...f, visitor_info: { ...f.visitor_info, places_to_visit: e.target.value } }))}
                    className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                    rows={3} placeholder="e.g. Dashashwamedh Ghat (1 km), Assi Ghat (3 km), Sarnath (10 km)..." />
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button onClick={handleSubmit}
                className="text-white px-6 py-2 rounded-lg text-sm font-medium transition"
                style={{ background: 'linear-gradient(135deg, #7B1F1F, #B5390A)' }}>
                {editTemple ? 'Update Temple' : 'Add Temple'}
              </button>
              <button onClick={() => { setShowForm(false); setEditTemple(null); setForm(defaultForm); }}
                className="bg-stone-100 text-stone-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-stone-200 transition">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white rounded-2xl shadow overflow-hidden border border-orange-100">
          {loading ? (
            <div className="p-8 text-center text-stone-500">Loading...</div>
          ) : (
            <table className="w-full text-sm">
              <thead style={{ background: '#FDF0E6' }}>
                <tr>
                  <th className="text-left px-6 py-3 text-stone-600 font-semibold">Temple</th>
                  <th className="text-left px-6 py-3 text-stone-600 font-semibold">Location</th>
                  <th className="text-left px-6 py-3 text-stone-600 font-semibold">Status</th>
                  <th className="text-left px-6 py-3 text-stone-600 font-semibold">Featured</th>
                  <th className="text-left px-6 py-3 text-stone-600 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {temples.map((t, i) => (
                  <tr key={t.id} className={`border-t border-orange-50 ${i % 2 === 0 ? 'bg-white' : 'bg-orange-50/30'}`}>
                    <td className="px-6 py-4 font-medium text-stone-800">{t.name}</td>
                    <td className="px-6 py-4 text-stone-500">{t.city}, {t.state}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        t.status === 'approved' ? 'bg-green-100 text-green-700' :
                        t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'}`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{t.is_featured ? '⭐ Yes' : '—'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(t)}
                          className="bg-orange-100 text-orange-700 px-3 py-1 rounded-lg text-xs font-medium hover:bg-orange-200 transition">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(t.id)}
                          className="bg-red-100 text-red-600 px-3 py-1 rounded-lg text-xs font-medium hover:bg-red-200 transition">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;