import { create } from 'zustand';
import { eventsService } from '../services/events.service';

export const useEventsStore = create((set, get) => ({
  // State
  events: [],
  currentEvent: null,
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    total: 0
  },
  searchQuery: '',

  // Actions
  loadEvents: async (page = 1, search = '') => {
    try {
      set({ loading: true, error: null });
      
      const response = await eventsService.getAll(page, 10, search);
      
      set({
        events: response.events,
        pagination: {
          currentPage: response.current_page,
          totalPages: response.total_pages,
          total: response.total
        },
        searchQuery: search,
        loading: false,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Error al cargar eventos';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  },

  loadEventById: async (id) => {
    try {
      set({ loading: true, error: null });
      
      const event = await eventsService.getById(id);
      
      set({
        currentEvent: event,
        loading: false,
      });

      return { success: true, data: event };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Error al cargar evento';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  },

  createEvent: async (eventData) => {
    try {
      set({ loading: true, error: null });
      
      const newEvent = await eventsService.create(eventData);
      
      set((state) => ({
        events: [newEvent, ...state.events],
        loading: false,
      }));

      return { success: true, data: newEvent };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Error al crear evento';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  },

  updateEvent: async (id, eventData) => {
    try {
      set({ loading: true, error: null });
      
      const updatedEvent = await eventsService.update(id, eventData);
      
      set((state) => ({
        events: state.events.map(event => 
          event.id === id ? updatedEvent : event
        ),
        currentEvent: state.currentEvent?.id === id ? updatedEvent : state.currentEvent,
        loading: false,
      }));

      return { success: true, data: updatedEvent };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Error al actualizar evento';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  },

  deleteEvent: async (id) => {
    try {
      set({ loading: true, error: null });
      
      await eventsService.delete(id);
      
      set((state) => ({
        events: state.events.filter(event => event.id !== id),
        currentEvent: state.currentEvent?.id === id ? null : state.currentEvent,
        loading: false,
      }));

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Error al eliminar evento';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  },

  searchEvents: async (query) => {
    try {
      set({ loading: true, error: null, searchQuery: query });
      
      const events = await eventsService.search(query);
      
      set({
        events: events,
        pagination: { 
          currentPage: 1, 
          totalPages: 1, 
          total: events.length 
        },
        loading: false,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Error en la búsqueda';
      set({ 
        loading: false, 
        error: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  },

  clearError: () => set({ error: null }),
  clearCurrentEvent: () => set({ currentEvent: null }),
}));