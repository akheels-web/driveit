const { createClient } = require('@libsql/client');

async function dropIndex() {
  const db = createClient({ url: 'file:./driveit.db' });
  try {
    await db.execute('DROP INDEX IF EXISTS services_slug_idx;');
    console.log('Successfully dropped services_slug_idx');
  } catch (err) {
    console.error('Error:', err);
  }
}

dropIndex();
