import * as migration_20261007_214901_initial from './20261007_214901_initial';
import * as migration_20261007_221558_media_storage_fields from './20261007_221558_media_storage_fields';

export const migrations = [
  {
    up: migration_20261007_214901_initial.up,
    down: migration_20261007_214901_initial.down,
    name: '20261007_214901_initial',
  },
  {
    up: migration_20261007_221558_media_storage_fields.up,
    down: migration_20261007_221558_media_storage_fields.down,
    name: '20261007_221558_media_storage_fields'
  },
];
