import * as migration_20260703_194117 from './20260703_194117';
import * as migration_20260704_010000_split_site_settings_into_page_globals from './20260704_010000_split_site_settings_into_page_globals';
import * as migration_20260704_020000_team_members_tags_to_hasmany_text from './20260704_020000_team_members_tags_to_hasmany_text';
import * as migration_20260704_030000_publications_authors_to_hasmany_text from './20260704_030000_publications_authors_to_hasmany_text';

export const migrations = [
  {
    up: migration_20260703_194117.up,
    down: migration_20260703_194117.down,
    name: '20260703_194117',
  },
  {
    up: migration_20260704_010000_split_site_settings_into_page_globals.up,
    down: migration_20260704_010000_split_site_settings_into_page_globals.down,
    name: '20260704_010000_split_site_settings_into_page_globals',
  },
  {
    up: migration_20260704_020000_team_members_tags_to_hasmany_text.up,
    down: migration_20260704_020000_team_members_tags_to_hasmany_text.down,
    name: '20260704_020000_team_members_tags_to_hasmany_text',
  },
  {
    up: migration_20260704_030000_publications_authors_to_hasmany_text.up,
    down: migration_20260704_030000_publications_authors_to_hasmany_text.down,
    name: '20260704_030000_publications_authors_to_hasmany_text',
  },
];
