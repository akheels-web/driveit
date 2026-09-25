import * as migration_20260924_045048_initial from './20260924_045048_initial';
import * as migration_20260924_071135 from './20260924_071135';
import * as migration_20260924_073813 from './20260924_073813';
import * as migration_20260925_072756 from './20260925_072756';

export const migrations = [
  {
    up: migration_20260924_045048_initial.up,
    down: migration_20260924_045048_initial.down,
    name: '20260924_045048_initial',
  },
  {
    up: migration_20260924_071135.up,
    down: migration_20260924_071135.down,
    name: '20260924_071135',
  },
  {
    up: migration_20260924_073813.up,
    down: migration_20260924_073813.down,
    name: '20260924_073813',
  },
  {
    up: migration_20260925_072756.up,
    down: migration_20260925_072756.down,
    name: '20260925_072756'
  },
];
