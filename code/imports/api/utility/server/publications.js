import { Meteor } from 'meteor/meteor';
import { Roles } from 'meteor/alanning:roles';
import Documents from '../../documents/documents';

Meteor.publish('utility.users', function utilityUsers() {
  return Roles.userIsInRole(this.userId, 'admin') ? [
    Meteor.users.find(),
    Documents.find(),
  ] : [];
});
