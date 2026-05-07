import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

const STATUS_CLR = {
  scheduled:        'text-yellow-400 bg-yellow-400/10',
  driver_assigned:  'text-blue-400 bg-blue-400/10',
  en_route:         'text-neon-purple bg-neon-purple/10',
  arrived:          'text-green-400 bg-green-400/10',
  completed:        'text-white/40 bg-white/5',
  cancelled:        'text-red-400 bg-red-400/10',
};

export default function AdminTransport() {
  const [transports, setTransports] = useState([]);
  const [drivers, setDrivers]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [assigning, setAssigning]   = useState(null);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [driverForm, setDriverForm] = useState({ name: '', phone: '', whatsapp: '', licenseNumber: '', vehicleType: 'cab', vehicleNumber: '', vehicleModel: '' });
  const [savingDriver, setSavingDriver] = useState(false);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      api.get('/transport'),
      api.get('/transport/drivers'),
    ]).then(([tRes, dRes]) => {
      setTransports(tRes.data.transports || []);
      setDrivers(dRes.data.drivers || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  const assignDriver = async (transportId, driverId) => {
    setAssigning(transportId);
    try {
      await api.patch(`/transport/${transportId}/assign`, { driverId });
      toast.success('Driver assigned & notified via WhatsApp!');
      fetchData();
    } catch { toast.error('Assignment failed'); }
    finally { setAssigning(null); }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(`/transport/${id}/status`, { status });
      toast.success('Status updated');
      fetchData();
    } catch { toast.error('Update failed'); }
  };

  const saveDriver = async (e) => {
    e.preventDefault();
    setSavingDriver(true);
    try {
      await api.post('/transport/drivers', driverForm);
      toast.success('Driver added!');
      setShowAddDriver(false);
      setDriverForm({ name: '', phone: '', whatsapp: '', licenseNumber: '', vehicleType: 'cab', vehicleNumber: '', vehicleModel: '' });
      fetchData();
    } catch { toast.error('Failed to add driver'); }
    finally { setSavingDriver(false); }
  };

  const availableDrivers = drivers.filter(d => d.isAvailable);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black">Transport Board</h1>
          <p className="text-white/40 text-sm mt-1">{transports.filter(t => t.status !== 'completed').length} active transports</p>
        </div>
        <button onClick={() => setShowAddDriver(!showAddDriver)} className="btn-neon text-sm px-4 py-2">
          + Add Driver
        </button>
      </div>

      {/* Add driver form */}
      {showAddDriver && (
        <div className="glass-card p-6">
          <h3 className="font-bold mb-4">Add New Driver</h3>
          <form onSubmit={saveDriver} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="block text-xs text-white/50 mb-1">Full Name</label><input required value={driverForm.name} onChange={e => setDriverForm({...driverForm, name: e.target.value})} className="input-field" /></div>
            <div><label className="block text-xs text-white/50 mb-1">Phone</label><input required value={driverForm.phone} onChange={e => setDriverForm({...driverForm, phone: e.target.value})} className="input-field" /></div>
            <div><label className="block text-xs text-white/50 mb-1">WhatsApp</label><input value={driverForm.whatsapp} onChange={e => setDriverForm({...driverForm, whatsapp: e.target.value})} className="input-field" /></div>
            <div><label className="block text-xs text-white/50 mb-1">License No.</label><input required value={driverForm.licenseNumber} onChange={e => setDriverForm({...driverForm, licenseNumber: e.target.value})} className="input-field" /></div>
            <div><label className="block text-xs text-white/50 mb-1">Vehicle Type</label>
              <select value={driverForm.vehicleType} onChange={e => setDriverForm({...driverForm, vehicleType: e.target.value})} className="input-field">
                <option value="cab" style={{background:'#0d0d2b'}}>Cab</option>
                <option value="bike" style={{background:'#0d0d2b'}}>Bike</option>
                <option value="both" style={{background:'#0d0d2b'}}>Both</option>
              </select>
            </div>
            <div><label className="block text-xs text-white/50 mb-1">Vehicle Number</label><input required value={driverForm.vehicleNumber} onChange={e => setDriverForm({...driverForm, vehicleNumber: e.target.value})} className="input-field" /></div>
            <div className="sm:col-span-2"><label className="block text-xs text-white/50 mb-1">Vehicle Model</label><input value={driverForm.vehicleModel} onChange={e => setDriverForm({...driverForm, vehicleModel: e.target.value})} className="input-field" /></div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" disabled={savingDriver} className="btn-neon px-6 py-2 disabled:opacity-50">{savingDriver ? 'Saving...' : 'Add Driver'}</button>
              <button type="button" onClick={() => setShowAddDriver(false)} className="btn-outline px-6 py-2">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Available drivers */}
      <div className="glass-card p-5">
        <h3 className="font-bold text-sm mb-3 text-white/70">🟢 Available Drivers ({availableDrivers.length})</h3>
        <div className="flex gap-3 flex-wrap">
          {availableDrivers.length === 0
            ? <p className="text-white/30 text-sm">No available drivers</p>
            : availableDrivers.map(d => (
              <div key={d.id} className="glass-card-dark px-4 py-2 rounded-xl text-sm">
                <span className="font-medium">{d.name}</span>
                <span className="text-white/40 ml-2 text-xs">{d.vehicleType} · {d.vehicleNumber}</span>
              </div>
            ))}
        </div>
      </div>

      {/* Transport list */}
      <div className="space-y-4">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="glass-card h-28 animate-pulse" />)
        ) : transports.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <div className="text-5xl mb-3">🚗</div>
            <p className="text-white/40">No transport bookings yet</p>
          </div>
        ) : transports.map((t) => (
          <div key={t.id} className="glass-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xl">{t.type === 'cab' ? '🚗' : '🏍️'}</span>
                  <div>
                    <span className="font-bold text-sm">{t.booking?.user?.name}</span>
                    <span className="text-white/40 text-xs ml-2">{t.booking?.user?.phone}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_CLR[t.status] || 'text-white/40 bg-white/5'}`}>
                    {t.status.replace('_', ' ')}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-white/50">
                  <span>📍 {t.pickupLocation}</span>
                  <span>⏰ Pickup: {t.pickupTime}</span>
                  <span>🎟️ {t.booking?.bookingId}</span>
                  {t.driver && <span className="text-blue-400">🧑 {t.driver.name} · {t.driver.vehicleNumber}</span>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                {/* Assign driver */}
                {!t.driver && t.status === 'scheduled' && (
                  <select
                    disabled={assigning === t.id}
                    onChange={(e) => e.target.value && assignDriver(t.id, e.target.value)}
                    className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 cursor-pointer"
                    defaultValue=""
                  >
                    <option value="" style={{background:'#0d0d2b'}}>Assign Driver...</option>
                    {availableDrivers.map(d => (
                      <option key={d.id} value={d.id} style={{background:'#0d0d2b'}}>{d.name} ({d.vehicleType})</option>
                    ))}
                  </select>
                )}

                {/* Status update */}
                <select
                  value={t.status}
                  onChange={(e) => updateStatus(t.id, e.target.value)}
                  className="text-xs bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-white/70 cursor-pointer"
                >
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
