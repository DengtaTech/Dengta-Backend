import { DataSource } from 'typeorm';

export const testHelper = {
  clearDatabase: async (dataSource: DataSource) => {
    const tables = [
      'Users',
      'UserCredentials',
      'Roles',
      'Footprints',
      'UserRoles',
      'Followship',
      'ProfileTagType',
      'ProfileHashTags',
      'FootprintTagType',
      'FootprintHashTags',
      'ReactionType',
      'FootprintReactions',
      'Links',
    ];
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 0;');
    for (const table of tables) {
      await dataSource.query(`TRUNCATE TABLE \`${table}\`;`);
    }
    await dataSource.query('SET FOREIGN_KEY_CHECKS = 1;');
  },
};
