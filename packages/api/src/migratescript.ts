export default async function migrateScript(db: D1Database) {
  await db
    .prepare(
      `
        CREATE TABLE IF NOT EXISTS benchmarks (
          location_hint TEXT,
          timestamp_before_request INTEGER NOT NULL,
          timestamp_after_request INTEGER NOT NULL,
          duration_ms INTEGER NOT NULL,
          success INTEGER NOT NULL,
          from_response___time INTEGER,
          from_response___time_iso TEXT,
          from_response___hash TEXT
        )

        CREATE TABLE IF NOT EXISTS purges (
          timestamp_before_purge INTEGER NOT NULL,
          timestamp_after_purge INTEGER NOT NULL,
          purge_duration_ms INTEGER NOT NULL,
          created_at INTEGER NOT NULL,
          timestamp_iso TEXT NOT NULL
        )
      `
    )
    .run();
}
