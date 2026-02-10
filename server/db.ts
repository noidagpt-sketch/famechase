import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  if (duration > 1000) {
    console.log("Slow query:", { text, duration, rows: res.rowCount });
  }
  return res;
}
