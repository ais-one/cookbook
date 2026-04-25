// ─── RBAC tenant types ────────────────────────────────────────────────────────

export interface TenantEntry {
  tenant_id: number;
  tenant_plan: string | null;
  roles: Set<string>;
}

export interface TenantRoleEntry {
  roles: Set<string>;
  permissions: Set<string>;
}

// ─── Keystore entry ───────────────────────────────────────────────────────────

export interface KeyEntry {
  kid: string;
  privateKey: string;
  publicKey: string;
  createdAt: Date;
}
