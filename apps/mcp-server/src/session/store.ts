import { ZakatFormData, defaultFormData } from "@zakatflow/core";
import { v4 as uuidv4 } from 'uuid';

export interface ZakatSessionState {
    id: string;
    formData: ZakatFormData;
    lastUpdated: number;
}

// In-memory store
const sessions = new Map<string, ZakatSessionState>();

export const SessionStore = {
    create: (): ZakatSessionState => {
        const id = uuidv4();
        const session: ZakatSessionState = {
            id,
            formData: { ...defaultFormData },
            lastUpdated: Date.now()
        };
        sessions.set(id, session);
        return session;
    },

    get: (id: string): ZakatSessionState | undefined => {
        return sessions.get(id);
    },

    update: (id: string, updates: Partial<ZakatFormData>): ZakatSessionState | undefined => {
        const session = sessions.get(id);
        if (!session) return undefined;

        session.formData = { ...session.formData, ...updates };
        session.lastUpdated = Date.now();
        sessions.set(id, session);
        return session;
    },

    delete: (id: string): boolean => {
        return sessions.delete(id);
    }
};
