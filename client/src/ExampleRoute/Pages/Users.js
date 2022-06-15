import { useState, useEffect } from 'react';
import axios from 'axios';

import TableButtons from '../Common/TableButtons';
import { getNewTableData } from '../../utils';

export const Users = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userList, setUserList] = useState([]);

  const updateTableData = async () => {
    try {
      const newData = await getNewTableData('/users');
      setUserList(newData);
    } catch (e) {
      // notify user
    }
  };

  // pattern copied from https://stackoverflow.com/a/53572588/14257952 May 2022
  useEffect(() => {
    updateTableData();
  }, []);

  const handleDelete = async id => {
    try {
      // update database
      await axios.delete(id && '/users' + id);

      // Update UI table by fetching all data, in case another user has also changed the db.
      // If that is not a concern, a more efficient alternative is to directly call setUserList()
      updateTableData();
      // notify user
    } catch (e) {
      // notify user
    }
  };

  const handleCreateSave = async () => {
    try {
      // update database
      await axios.post('/users', { userData: selectedUser });

      // Update UI table by fetching all data, in case another user has also changed the db.
      // If that is not a concern, a more efficient alternative is to directly call setUserList()
      updateTableData();
      // notify user
    } catch (e) {
      // notify user
    }
  };

  const handleEditSave = async () => {
    try {
      // update database
      await axios.put('/users', { userData: selectedUser });

      // Update UI table by fetching all data, in case another user has also changed the db.
      // If that is not a concern, a more efficient alternative is to directly call setUserList()
      updateTableData();
      // notify user
    } catch (e) {
      // notify user
    }
  };

  return (
    <>
      <h2>
        Users page
      </h2>
      <TableButtons></TableButtons>
    </>
  );
};

export default Users;
