import { create } from 'zustand';
import api from '../utils/api';

export const useBookingStore = create((set, get) => ({
  // Multi-step booking state
  step: 1,
  selectedClub: null,
  selectedPackage: null,
  bookingData: {
    visitDate: '',
    visitTime: '',
    numberOfPeople: 1,
    guestType: 'single',
    tableRequired: false,
    transportType: 'none',
    pickupLocation: '',
    pickupTime: '',
    specialRequests: '',
    promoCode: '',
  },
  currentBooking: null,
  isLoading: false,

  setStep: (step) => set({ step }),
  setSelectedClub: (club) => set({ selectedClub: club }),
  setSelectedPackage: (pkg) => set({ selectedPackage: pkg }),
  updateBookingData: (data) =>
    set((state) => ({ bookingData: { ...state.bookingData, ...data } })),

  resetBooking: () =>
    set({
      step: 1,
      selectedPackage: null,
      bookingData: {
        visitDate: '',
        visitTime: '',
        numberOfPeople: 1,
        guestType: 'single',
        tableRequired: false,
        transportType: 'none',
        pickupLocation: '',
        pickupTime: '',
        specialRequests: '',
        promoCode: '',
      },
      currentBooking: null,
    }),

  createBooking: async () => {
    set({ isLoading: true });
    try {
      const { selectedClub, selectedPackage, bookingData } = get();
      const payload = {
        clubId: selectedClub.id,
        packageId: selectedPackage?.id,
        ...bookingData,
      };

      const { data } = await api.post('/bookings', payload);
      set({ currentBooking: data.booking, isLoading: false });
      return { success: true, booking: data.booking };
    } catch (err) {
      set({ isLoading: false });
      return { success: false, error: err.response?.data?.error || 'Booking failed' };
    }
  },

  // Calculate price
  getTotal: () => {
    const { selectedPackage, bookingData } = get();
    if (!selectedPackage) return 0;
    const { numberOfPeople, guestType } = bookingData;

    if (guestType === 'couple' && selectedPackage.priceCouple) {
      return parseFloat(selectedPackage.priceCouple);
    }
    if (guestType === 'group' && selectedPackage.priceGroup) {
      return parseFloat(selectedPackage.priceGroup) * numberOfPeople;
    }
    return parseFloat(selectedPackage.pricePerPerson) * numberOfPeople;
  },

  getAdvance: () => {
    const total = get().getTotal();
    return parseFloat((total * 0.15).toFixed(2));
  },
}));
