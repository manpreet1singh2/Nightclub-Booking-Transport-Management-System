import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const EMPTY_FORM = { name:'', description:'', address:'', city:'', state:'', pincode:'', phone:'', email:'', ownerWhatsapp:'', capacity:200, openTime:'21:00', closeTime:'04:00', amenities:'' };

export default function AdminClubs() {
  const [clubs, setClubs]       = useState([]);
  const [packages, setPackages] = useState({});
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [expandedClub, setExpandedClub] = useState(null);

  const fetchClubs = () => {
    setLoading(true);
    api.get('/clubs?limit=50').then(({ data }) => setClubs(data.clubs || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetchClubs(); }, []);

  const fetchPackages = async (clubId) => {
    if (packages[clubId]) { setExpandedClub(expandedClub === clubId ? null : clubId); return; }
    const { data } = await api.get(`/clubs/${clubId}/packages`);
    setPackages(p => ({ ...p, [clubId]: data.packages }));
    setExpandedClub(clubId);
  };

  const startEdit = (club) => {
    setEditing(club.id);
    setForm({ ...EMPTY_FORM, ...club, amenities: (club.amenities || []).join(', ') });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, amenities: form.amenities.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editing) {
        await api.put(`/clubs/${editing}`, payload);
        toast.success('Club updated!');
      } else {
        await api.post('/clubs', payload);
        toast.success('Club created!');
      }
      setShowForm(false); setEditing(null); setForm(EMPTY_FORM);
      fetchClubs();
    } catch (err) { toast.error(err.response?.data?.error || 'Failed'); }
    finally { setSaving(false); }
  };

  const toggleActive = async (club) => {
    try {
      await api.put(`/clubs/${club.id}`, { isActive: !club.isActive });
      toast.success(`Club ${club.isActive ? 'deactivated' : 'activated'}`);
      fetchClubs();
    } catch { toast.error('Failed'); }
  };

  const ch = (f) => (e) => setForm({ ...form, [f]: e.target.value });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Clubs</h1>
          <p className="text-white/40 text-sm mt-1">{clubs.length} clubs registered</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(EMPTY_FORM); }}
          className="btn-neon text-sm px-4 py-2">
          {showForm ? 'Cancel' : '+ Add Club'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass-card p-6">
          <h3 className="font-bold mb-5">{editing ? 'Edit Club' : 'Add New Club'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['name','Club Name'],['description','Description (optional)'],['address','Full Address'],['city','City'],['state','State'],['pincode','Pincode'],['phone','Phone Number'],['email','Email'],['ownerWhatsapp','Owner WhatsApp']].map(([field, label]) => (
              <div key={field} className={field === 'description' || field === 'address' ? 'sm:col-span-2' : ''}>
                <label className="block text-xs text-white/50 mb-1">{label}</label>
                {field === 'description'
                  ? <textarea rows={2} value={form[field]} onChange={ch(field)} className="input-field resize-none" />
                  : <input type="text" required={!['description','email'].includes(field)} value={form[field]} onChange={ch(field)} className="input-field" />
                }
              </div>
            ))}
            <div>
              <label className="block text-xs text-white/50 mb-1">Capacity</label>
              <input type="number" min={1} value={form.capacity} onChange={ch('capacity')} className="input-field" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Open Time</label>
              <input type="time" value={form.openTime} onChange={ch('openTime')} className="input-field" style={{colorScheme:'dark'}} />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1">Close Time</label>
              <input type="time" value={form.closeTime} onChange={ch('closeTime')} className="input-field" style={{colorScheme:'dark'}} />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs text-white/50 mb-1">Amenities (comma-separated)</label>
              <input type="text" placeholder="Live DJ, Bar, VIP Lounge, Valet Parking" value={form.amenities} onChange={ch('amenities')} className="input-field" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="btn-neon px-6 py-2.5 disabled:opacity-50">
                {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Club'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="btn-outline px-6 py-2.5">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Clubs list */}
      {loading ? (
        <div className="space-y-4">{[1,2,3].map(i => <div key={i} className="glass-card h-24 animate-pulse" />)}</div>
      ) : (
        <div className="space-y-4">
          {clubs.map(club => (
            <div key={club.id} className="glass-card overflow-hidden">
              <div className="p-5 flex flex-wrap gap-4">
                <img src={club.images?.[0] || 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=150'}
                  alt={club.name} className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?w=150'; }} />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-bold">{club.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${club.isActive ? 'text-green-400 bg-green-400/10' : 'text-red-400 bg-red-400/10'}`}>
                      {club.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                  </div>
                  <p className="text-white/50 text-xs">📍 {club.city}, {club.state} | 📞 {club.phone} | ⭐ {club.rating}</p>
                  <p className="text-white/40 text-xs mt-1">👥 {club.capacity} capacity · {club.packages?.length || 0} packages</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => fetchPackages(club.id)}
                    className="text-xs glass-card px-3 py-1.5 hover:bg-white/10 transition-colors">
                    {expandedClub === club.id ? '▲ Packages' : '▼ Packages'}
                  </button>
                  <button onClick={() => startEdit(club)}
                    className="text-xs glass-card px-3 py-1.5 hover:bg-white/10 transition-colors text-neon-purple">
                    ✏️ Edit
                  </button>
                  <button onClick={() => toggleActive(club)}
                    className={`text-xs px-3 py-1.5 rounded-xl border transition-colors ${
                      club.isActive ? 'border-red-400/30 text-red-400 hover:bg-red-400/10' : 'border-green-400/30 text-green-400 hover:bg-green-400/10'
                    }`}>
                    {club.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>

              {/* Packages */}
              {expandedClub === club.id && packages[club.id] && (
                <div className="border-t border-white/5 px-5 py-4 bg-white/2">
                  <p className="text-xs text-white/40 mb-3">PACKAGES</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {packages[club.id].map(pkg => (
                      <div key={pkg.id} className="glass-card-dark p-3 rounded-xl text-xs">
                        <div className="font-medium mb-1">{pkg.name}</div>
                        <div className="text-gold-400 font-bold">₹{pkg.pricePerPerson}/person</div>
                        <div className="text-white/30 mt-1 capitalize">{pkg.type.replace('_', ' ')}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
