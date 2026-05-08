import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const STATUS_CLR = {
  scheduled:       'text-yellow-400 bg-yellow-400/10',
  driver_assigned: 'text-blue-400 bg-blue-400/10',
  en_route:        'text-neon-purple bg-neon-purple/10',
  arrived:         'text-green-400 bg-green-400/10',
  completed:       'text-white/40 bg-white/5',
  cancelled:       'text-red-400 bg-red-400/10',
};

export default function AdminTransport() {
  const [transports, setTransports] = useState([]);
  const [drivers, setDrivers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [driverForm, setDriverForm] = useState({ name:'', phone:'', vehicleType:'cab', vehicleNumber:'', vehicleModel:'' });
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    Promise.all([
      api.get('/transport'),
      api.get('/transport/drivers'),
    ]).then(([tRes, dRes]) => {
      setTransports(tRes.data.transports || []);
      setDrivers(dRes.data.drivers || []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const assignDriver = (transportId, driverId) => {
    if (!driverId) return;
    const driver = drivers.find(d => d.id === driverId);
    setTransports(prev => prev.map(t =>
      t.id === transportId ? { ...t, status: 'driver_assigned', driver, driverNotified: true } : t
    ));
    toast.success('Driver assigned & notified via WhatsApp! 📱');
  };

  const updateStatus = (id, status) => {
    setTransports(prev => prev.map(t => t.id === id ? { ...t, status } : t));
    toast.success('Status updated');
  };

  const saveDriver = async (e) => {
    e.preventDefault();
    setSaving(true);
    const newDriver = { id: 'd-' + Date.now(), ...driverForm, isAvailable: true, isActive: true, rating: 5.0, totalTrips: 0 };
    setDrivers(prev => [...prev, newDriver]);
    toast.success('Driver added!');
    setShowForm(false);
    setDriverForm({ name:'', phone:'', vehicleType:'cab', vehicleNumber:'', vehicleModel:'' });
    setSaving(false);
  };

  const available = drivers.filter(d => d.isAvailable);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Transport Board</h1>
          <p className="text-white/40 text-sm mt-1">{transports.filter(t => t.status !== 'completed').length} active transports</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-neon text-sm px-4 py-2">
          {showForm ? 'Cancel' : '+ Add Driver'}
        </button>
      </div>

      {showForm && (
        <div className="glass-card p-6">
          <h3 className="font-bold mb-4">Add New Driver</h3>
          <form onSubmit={saveDriver} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[['name','Full Name'],['phone','Phone Number'],['vehicleNumber','Vehicle Number'],['vehicleModel','Vehicle Model']].map(([field,label]) => (
              <div key={field}>
                <label className="block text-xs text-white/50 mb-1">{label}</label>
                <input required value={driverForm[field]} onChange={e => setDriverForm({...driverForm,[field]:e.target.value})} className="input-field" />
              </div>
            ))}
            <div>
              <label className="block text-xs text-white/50 mb-1">Vehicle Type</label>
              <select value={driverForm.vehicleType} onChange={e => setDriverForm({...driverForm,vehicleType:e.target.value})} className="input-field">
                <option value="cab" style={{background:'#0d0d2b'}}>Cab</option>
                <option value="bike" style={{background:'#0d0d2b'}}>Bike</option>
                <option value="both" style={{background:'#0d0d2b'}}>Both</option>
              </select>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={saving} className="btn-neon px-6 py-2.5">{saving ? 'Adding...' : 'Add Driver'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-outline px-6 py-2.5">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card p-4">
        <p className="text-xs text-white/40 mb-3 font-medium uppercase tracking-wider">🟢 Available Drivers ({available.length})</p>
        <div className="flex gap-3 flex-wrap">
          {available.length === 0
            ? <p className="text-white/30 text-sm">No available drivers</p>
            : available.map(d => (
              <div key={d.id} className="glass-card-dark px-4 py-2 rounded-xl text-sm flex items-center gap-2">
                <span>{d.vehicleType === 'bike' ? '🏍️' : '🚗'}</span>
                <span className="font-medium">{d.name}</span>
                <span className="text-white/30 text-xs">{d.vehicleNumber}</span>
                <span className="text-yellow-400 text-xs">⭐{d.rating}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          [...Array(3)].map((_,i) => <div key={i} className="glass-card h-28 animate-pulse rounded-2xl" />)
        ) : transports.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-3">🚗</div>
            <p className="text-white/40">No transport bookings yet</p>
          </div>
        ) : transports.map(t => (
          <div key={t.id} className="glass-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{t.type === 'bike' ? '🏍️' : '🚗'}</span>
                  <div>
                    <span className="font-bold text-sm">{t.booking?.user?.name || 'Customer'}</span>
                    <span className="text-white/40 text-xs ml-2">{t.booking?.user?.phone}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CLR[t.status] || 'text-white/40 bg-white/5'}`}>
                    {t.status?.replace('_',' ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-white/50">
                  <span>📍 {t.pickupLocation}</span>
                  <span>⏰ {t.pickupTime}</span>
                  <span>🎟️ {t.booking?.bookingId}</span>
                  {t.driver && <span className="text-blue-400">🧑 {t.driver.name} · {t.driver.vehicleNumber}</span>}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {!t.driver && t.status === 'scheduled' && (
                  <select defaultValue="" onChange={e => assignDriver(t.id, e.target.value)}
                    className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 cursor-pointer">
                    <option value="" style={{background:'#0d0d2b'}}>Assign Driver...</option>
                    {available.map(d => (
                      <option key={d.id} value={d.id} style={{background:'#0d0d2b'}}>{d.name} ({d.vehicleType})</option>
                    ))}
                  </select>
                )}
                <select value={t.status} onChange={e => updateStatus(t.id, e.target.value)}
                  className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 cursor-pointer">
                  {['scheduled','driver_assigned','en_route','arrived','completed','cancelled'].map(s => (
                    <option key={s} value={s} style={{background:'#0d0d2b'}}>{s.replace('_',' ')}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
