import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/authStore';

export default function RegisterPage() {
  const [form, setForm]      = useState({ name: '', email: '', phone: '', password: '' });
  const [show, setShow]      = useState(false);
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (!/^[6-9]\d{9}$/.test(form.phone)) { toast.error('Enter a valid 10-digit Indian phone number'); return; }

    const res = await register(form);
    if (res.success) {
      toast.success('Account created! Welcome to NightVibe 🎉');
      navigate('/clubs');
    } else {
      toast.error(res.error);
    }
  };

  const change = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-purple/15 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-pink/10 rounded-full blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md my-12">
        <div className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🎉</div>
            <h1 className="text-2xl font-black">Create Account</h1>
            <p className="text-white/50 mt-1">Join NightVibe for free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Full Name</label>
              <input type="text" required placeholder="Rahul Sharma" value={form.name} onChange={change('name')} className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Email Address</label>
              <input type="email" required placeholder="you@example.com" value={form.email} onChange={change('email')} className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Phone Number <span className="text-white/30 font-normal">(WhatsApp)</span>
              </label>
              <div className="flex gap-2">
                <span className="input-field w-16 text-center text-white/50 flex-shrink-0">+91</span>
                <input type="tel" required maxLength={10} placeholder="9876543210" value={form.phone} onChange={change('phone')} className="input-field" />
              </div>
              <p className="text-xs text-white/30 mt-1.5">Booking confirmations sent on WhatsApp</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">Password</label>
              <div className="relative">
                <input type={show ? 'text' : 'password'} required minLength={8} placeholder="Min. 8 characters"
                  value={form.password} onChange={change('password')} className="input-field pr-12" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {show ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="btn-neon w-full py-3.5 text-base disabled:opacity-50">
              {isLoading ? 'Creating account...' : 'Create Free Account 🎉'}
            </button>

            <p className="text-xs text-white/30 text-center">
              By signing up you agree to our{' '}
              <a href="#" className="text-neon-purple hover:underline">Terms</a> and{' '}
              <a href="#" className="text-neon-purple hover:underline">Privacy Policy</a>
            </p>
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-neon-purple hover:text-neon-pink transition-colors font-medium">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
