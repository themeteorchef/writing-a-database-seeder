import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import Documents from '../../documents/documents';
import seeder from '../../../modules/server/seeder';

const documentsSeed = (userId, firstName) => ({
  collection: Documents,
  environments: ['development', 'staging'],
  noLimit: true,
  modelCount: 2,
  model(dataIndex) {
    return {
      owner: userId,
      title: `${firstName} Document #${dataIndex + 1}`,
      body: `This is the body of document #${dataIndex + 1}`,
    };
  },
});

Meteor.methods({
  'utility.seedUsers': function utilitySeedUsers() {
    seeder(Meteor.users, {
      environments: ['development', 'staging'],
      noLimit: true,
      modelCount: 5,
      model(index, faker) {
        const userCount = index + 1;
        const first = faker.name.firstName();
        return {
          email: `user+${userCount}@test.com`,
          password: 'password',
          profile: {
            name: {
              first,
              last: faker.name.lastName(),
            },
          },
          roles: ['user'],
          data(userId) {
            return documentsSeed(userId, first);
          },
        };
      },
    });
  },
  'utility.resetUsers': function utilitySeedUsers() {
    const users = Meteor.users.find({ 'emails.address': { $ne: 'admin@admin.com' } }).fetch();
    const userIds = _.pluck(users, '_id');

    Documents.remove({ owner: { $in: userIds } });
    Meteor.users.remove({ _id: { $in: userIds } });
  },
});
