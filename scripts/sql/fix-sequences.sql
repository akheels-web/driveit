-- Resynchronises Postgres id sequences after data was imported with explicit ids.
--
-- Why this is required: `scripts/import-content.ts` inserts rows with their
-- original ids (so relationships and booking references survive the move). The
-- sequence behind each `id` column is not advanced by those inserts, so the very
-- next normal write would try to reuse id 1 and fail with a duplicate key error.
--
-- Usage:
--   psql "$DATABASE_URI" -f scripts/sql/fix-sequences.sql
--   docker compose exec -T postgres psql -U driveit -d driveit < scripts/sql/fix-sequences.sql
--
-- Safe to run repeatedly.

DO $$
DECLARE
  target record;
BEGIN
  FOR target IN
    SELECT c.table_name, c.column_name
    FROM information_schema.columns c
    JOIN information_schema.tables t
      ON t.table_schema = c.table_schema
     AND t.table_name = c.table_name
    WHERE c.table_schema = 'public'
      AND t.table_type = 'BASE TABLE'
      AND c.column_name = 'id'
  LOOP
    BEGIN
      EXECUTE format(
        'SELECT setval(pg_get_serial_sequence(%L, %L), GREATEST(COALESCE((SELECT MAX(id) FROM %I), 1), 1))',
        target.table_name,
        target.column_name,
        target.table_name
      );
      RAISE NOTICE 'resynced sequence for %.id', target.table_name;
    EXCEPTION WHEN others THEN
      -- Tables without a serial id (or system tables) are simply skipped.
      RAISE NOTICE 'skipped %: %', target.table_name, SQLERRM;
    END;
  END LOOP;
END $$;

-- Sanity check: show each table's max id next to its sequence's next value.
SELECT
  c.relname AS table_name,
  pg_get_serial_sequence(c.relname, 'id') AS sequence_name,
  last_value AS sequence_last_value
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
LEFT JOIN pg_sequences s ON s.sequencename = pg_get_serial_sequence(c.relname, 'id')
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND pg_get_serial_sequence(c.relname, 'id') IS NOT NULL
ORDER BY c.relname;
