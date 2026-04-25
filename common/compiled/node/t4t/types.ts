import type { NextFunction, Request, Response } from 'express';

// ─── Column definition loaded from YAML table config ─────────────────────────

export interface ColDef {
  required?: boolean;
  multiKey?: boolean;
  auto?: string | false;
  editor?: string | boolean;
  edit?: boolean | string;
  creator?: string | boolean;
  add?: boolean | string;
  hide?: 'omit' | 'blank';
  type?: string;
  ui?: {
    tag?: string;
    attrs?: {
      type?: string;
      pattern?: string;
      maxLength?: number;
      maxlength?: number;
      min?: number | string;
      max?: number | string;
    };
    [key: string]: unknown;
  };
  options?: {
    foreignKey?: string;
    tableName?: string;
    key?: string;
    text?: string;
    column?: string;
    joinFromTable?: string;
  };
}

// ─── Table definition built from YAML + middleware augmentation ───────────────

export interface TableDef {
  name: string;
  conn: string;
  pk: string;
  multiKey: string[];
  required: string[];
  auto: string[];
  cols: Record<string, ColDef>;
  view: string | boolean;
  create: string | boolean;
  update: string | boolean;
  delete: string | boolean;
  import: string | boolean;
  export: string | boolean;
  select?: string;
  defaultSort?: unknown[];
  deleteLimit: number;
  fileConfigUi: Record<string, unknown>;
  db: string;
}

// ─── Relation metadata returned by mapRelation ────────────────────────────────

export interface RelationDef {
  table2: string;
  table2Id: string;
  table2Text: string;
  table1Id: string;
  tableJoinFrom: string;
  table2Column: string;
}

// ─── Express Request extended with t4t table context ─────────────────────────

export interface T4TRequest extends Request {
  table: TableDef;
  fileCount?: Record<string, number>;
}

// ─── File upload UI configuration ────────────────────────────────────────────

export interface FileUiConfig {
  multer: {
    folder?: string;
    options?: { limits?: { files?: number } };
  };
}

// ─── t4t router options ───────────────────────────────────────────────────────

export interface T4TOptions {
  authFunc?: (req: Request, res: Response, next: NextFunction) => void;
}

// ─── Internal types ───────────────────────────────────────────────────────────

export type InvalidInputResult = { status: string; message: string; key?: string | null } | false;

export interface AuditData {
  user: string;
  timestamp: Date;
  db_name: string;
  table_name: string;
  op: string;
  where_cols: string;
  where_vals: string;
  cols_changed: string;
  prev_values: string;
  new_values: string;
}
