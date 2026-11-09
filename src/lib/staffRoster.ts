export type StaffRole = 'owner' | 'admin' | 'moderator' | 'crew';

export interface StaffUser {
  id: string;
  email: string;
  name: string;
  role: StaffRole;
  callsign: string;
  clearanceLevel: string;
  avatarSeed?: string;
}

// Preconfigured staff roster for authorized roles
export const DEMO_STAFF_ACCOUNTS: Record<string, StaffUser> = {
  'owner@foxbatintelligence.com': {
    id: 'usr-owner-001',
    email: 'owner@foxbatintelligence.com',
    name: 'Command Directive',
    role: 'owner',
    callsign: 'FOX-ALPHA',
    clearanceLevel: 'LEVEL 5 — ROOT SYSTEM OVERSEER',
  },
  'admin@foxbatintelligence.com': {
    id: 'usr-admin-002',
    email: 'admin@foxbatintelligence.com',
    name: 'Site Administrator',
    role: 'admin',
    callsign: 'FOX-BRAVO',
    clearanceLevel: 'LEVEL 4 — CONTENT & SERVICE CATALOG',
  },
  'moderator@foxbatintelligence.com': {
    id: 'usr-mod-003',
    email: 'moderator@foxbatintelligence.com',
    name: 'Community Moderator',
    role: 'moderator',
    callsign: 'FOX-CHARLIE',
    clearanceLevel: 'LEVEL 3 — COMMUNITY & STUDENT INITIATIVE',
  },
  'crew@foxbatintelligence.com': {
    id: 'usr-crew-004',
    email: 'crew@foxbatintelligence.com',
    name: 'Technical Security Crew',
    role: 'crew',
    callsign: 'FOX-DELTA',
    clearanceLevel: 'LEVEL 3 — VULNERABILITY ASSESSMENT & AUDIT',
  },
};

