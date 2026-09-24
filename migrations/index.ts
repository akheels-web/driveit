import * as migration_20260924_045048_initial from './20260924_045048_initial';
import * as migration_20260924_071135 from './20260924_071135';
import * as migration_20260924_073813 from './20260924_073813';

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
    name: '20260924_073813'
  },
];
