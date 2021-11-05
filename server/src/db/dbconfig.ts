import { Pool } from 'pg';

export const pool = new Pool({
  max: 20,
  connectionString: 'postgres://timber:yukon@localhost:5438/timber',
  idleTimeoutMillis: 30000,
});
