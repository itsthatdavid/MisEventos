import { authService } from './auth.service';
import { eventsService } from './events.service';
import { sessionsService } from './sessions.service';
import { assistanceService } from './assistance.service';
import { usersService } from './users.service';

// Re-export the token setter so it can be imported from the same place as before
export { setAuthToken } from './api';

// Assemble the final service object to maintain the same structure
export const apiService = {
  auth: authService,
  events: eventsService,
  sessions: sessionsService,
  assistance: assistanceService,
  users: usersService,
};