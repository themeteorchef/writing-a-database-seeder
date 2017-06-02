import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { Button } from 'react-bootstrap';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Bert } from 'meteor/themeteorchef:bert';
import container from '../../modules/container';
import Documents from '../../api/documents/documents';

const handleSeed = () => {
  Meteor.call('utility.seedUsers', (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Users collection seeded!', 'success');
    }
  });
};

const handleReset = () => {
  Meteor.call('utility.resetUsers', (error) => {
    if (error) {
      Bert.alert(error.reason, 'danger');
    } else {
      Bert.alert('Users collection reset!', 'success');
    }
  });
};

const Users = ({ users }) => (
  <div className="Users">
    <div className="page-header clearfix">
      <h4 className="pull-left">Users</h4>
      <Button
        className="pull-right"
        bsStyle="danger"
        onClick={handleReset}
      >Reset Users</Button>
      <Button
        className="pull-right"
        bsStyle="success"
        onClick={handleSeed}
      >Seed Users</Button>
    </div>
    {users.map(({ _id, profile, documents }) => (<div key={_id}>
      <h5>{profile.name.first} {profile.name.last}</h5>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Title</th>
          </tr>
        </thead>
        <tbody>
          {documents.map(doc => (<tr key={doc._id}>
            <td key={doc._id}><Link to={`/documents/${doc._id}`}>{doc.title}</Link></td>
          </tr>))}
        </tbody>
      </table>
    </div>))}
  </div>
);

Users.propTypes = {
  users: PropTypes.array.isRequired,
};

export default container((props, onData) => {
  const subscription = Meteor.subscribe('utility.users');
  if (subscription.ready()) {
    const users = _.map(Meteor.users.find({ _id: { $ne: Meteor.userId() } }).fetch(), user => ({
      ...user,
      documents: Documents.find({ owner: user._id }).fetch(),
    }));

    onData(null, { users });
  }
}, Users);
