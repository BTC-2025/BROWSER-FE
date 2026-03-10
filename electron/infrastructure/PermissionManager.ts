// Permission Bundle System
// Manages security permissions for browser features, extensions, and agent actions.
// Uses a declarative permission model inspired by Chrome's manifest permissions.

export type PermissionScope =
    | 'browsing_history'
    | 'bookmarks'
    | 'downloads'
    | 'cookies'
    | 'geolocation'
    | 'camera'
    | 'microphone'
    | 'notifications'
    | 'clipboard'
    | 'storage'
    | 'tabs'
    | 'active_tab'
    | 'web_navigation'
    | 'dom_access'
    | 'form_submit'
    | 'network_requests';

export type PermissionLevel = 'granted' | 'denied' | 'prompt';

export interface PermissionEntry {
    scope: PermissionScope;
    level: PermissionLevel;
    grantedAt?: number;
    grantedTo?: string; // Extension or agent ID
    expiresAt?: number; // Optional expiration
}

export interface PermissionBundle {
    id: string;
    name: string;
    description: string;
    permissions: PermissionEntry[];
    createdAt: number;
}

export interface IPermissionManager {
    checkPermission(scope: PermissionScope, requesterId?: string): PermissionLevel;
    grantPermission(scope: PermissionScope, requesterId?: string, expiresIn?: number): void;
    denyPermission(scope: PermissionScope, requesterId?: string): void;
    revokeAll(requesterId: string): void;
    getPermissions(requesterId?: string): PermissionEntry[];
    createBundle(name: string, description: string, scopes: PermissionScope[]): PermissionBundle;
}

export class PermissionManager implements IPermissionManager {
    private permissions: Map<string, PermissionEntry> = new Map();
    private bundles: Map<string, PermissionBundle> = new Map();
    private counter = 0;

    private key(scope: PermissionScope, requesterId?: string): string {
        return `${scope}:${requesterId || 'system'}`;
    }

    checkPermission(scope: PermissionScope, requesterId?: string): PermissionLevel {
        const entry = this.permissions.get(this.key(scope, requesterId));
        if (!entry) return 'prompt';
        // Check expiration
        if (entry.expiresAt && Date.now() > entry.expiresAt) {
            this.permissions.delete(this.key(scope, requesterId));
            return 'prompt';
        }
        return entry.level;
    }

    grantPermission(scope: PermissionScope, requesterId?: string, expiresIn?: number): void {
        this.permissions.set(this.key(scope, requesterId), {
            scope,
            level: 'granted',
            grantedAt: Date.now(),
            grantedTo: requesterId,
            expiresAt: expiresIn ? Date.now() + expiresIn : undefined,
        });
    }

    denyPermission(scope: PermissionScope, requesterId?: string): void {
        this.permissions.set(this.key(scope, requesterId), {
            scope,
            level: 'denied',
            grantedAt: Date.now(),
            grantedTo: requesterId,
        });
    }

    revokeAll(requesterId: string): void {
        for (const [key] of this.permissions) {
            if (key.endsWith(`:${requesterId}`)) {
                this.permissions.delete(key);
            }
        }
    }

    getPermissions(requesterId?: string): PermissionEntry[] {
        const entries: PermissionEntry[] = [];
        for (const [key, entry] of this.permissions) {
            if (requesterId) {
                if (key.endsWith(`:${requesterId}`)) entries.push(entry);
            } else {
                entries.push(entry);
            }
        }
        return entries;
    }

    createBundle(name: string, description: string, scopes: PermissionScope[]): PermissionBundle {
        const bundle: PermissionBundle = {
            id: `bundle-${++this.counter}`,
            name,
            description,
            permissions: scopes.map((scope) => ({
                scope,
                level: 'prompt' as PermissionLevel,
            })),
            createdAt: Date.now(),
        };
        this.bundles.set(bundle.id, bundle);
        return bundle;
    }
}
