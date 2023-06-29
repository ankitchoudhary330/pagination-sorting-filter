import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { userActions } from '_store';
import moment from 'moment/moment';
import { useState } from 'react';
export { List };

function List() {
    const [filterValue, setFilterValue] = useState('');
    const [sortKey, setSortKey] = useState('firstName');
    const [sortOrder, setSortOrder] = useState('asc');
    const users = useSelector(x => x.users.list);
    const [selectedOption, setSelectedOption] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; 
  
    
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;


    const totalPages = Math.ceil(users?.value?.length / itemsPerPage);
  
    const handlePreviousPage = () => {
      setCurrentPage((prevPage) => prevPage - 1);
    };
    const filteredUsers = users?.value?.filter((user) =>
    user.firstName.toLowerCase().includes(filterValue.toLowerCase())
  );
  const sortedUsers = filteredUsers?.sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];

    if (sortOrder === 'asc') {
      if (aValue < bValue) return -1;
      if (aValue > bValue) return 1;
    } else {
      if (aValue > bValue) return -1;
      if (aValue < bValue) return 1;
    }

    return 0;
  });


  const currentUsers = sortedUsers?.slice(indexOfFirstUser, indexOfLastUser);
    const handleNextPage = () => {
      setCurrentPage((prevPage) => prevPage + 1);
    };
    const handleChange = (event) => {
      setSelectedOption(event.target.value);
 
    };
   
    const dispatch = useDispatch();

    
    useEffect(() => {
        dispatch(userActions.getAll());
    }, []);
    const handleFilterChange = (event) => {
        const { value } = event.target;
        setCurrentPage(1); 
        setFilterValue(value);
      };
    
    
    return (
    <div>
        <h1>Users</h1>
            <Link to="add" className="btn btn-sm btn-success mb-2">Add User</Link>
      <select style={{marginLeft:16,height:'30px'}} value={selectedOption} onChange={handleChange}>
      <option value="">12 Hour</option>
       <option value="true">24 Hour</option>
        
      
       </select>

       <input
       style={{marginLeft:16}}
        type="text"
        placeholder="Filter by username"
        value={filterValue}
        onChange={handleFilterChange}
      />

      <table className="table table-striped">
        <thead>
          <tr>
            <th style={{ width: '30%' }}>First Name</th>
            <th style={{ width: '30%' }}>Last Name</th>
            <th style={{ width: '30%' }}>Username</th>
            <th style={{ width: '30%' }}>Date</th>
            <th style={{ width: '10%' }}></th>
          </tr>
        </thead>
        <tbody>
          {currentUsers?.map((user) => (
             <tr key={user.id}>
                                          <td>{user.firstName}</td>
                                          <td>{user.lastName}</td>
                                          <td>{user.username}</td>
                                          {selectedOption?
                                           <td>{ moment(user.createdDate).format('DD-MM-YYYY HH:mm')}</td>
                                           :
                                          <td>{ moment(user.createdDate).format('DD-MM-YYYY hh:mm')}</td>
             
                                          
                                           } 
                                           
                                           <td style={{ whiteSpace: 'nowrap' }}>
                   <Link to={`edit/${user.id}`} className="btn btn-sm btn-primary me-1">Edit</Link>
                                 <button onClick={() => dispatch(userActions.delete(user.id))} className="btn btn-sm btn-danger" style={{ width: '60px' }} disabled={user.isDeleting}>
                                     {user.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button>
                            </td>
                                           
                                           </tr>
          ))}
            {users?.loading &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <span className="spinner-border spinner-border-lg align-center"></span>
                            </td>
                        </tr>
                    }
        </tbody>
      </table>

      {/* Pagination controls */}
      <div>
        <button
          className="btn btn-sm btn-secondary"
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span style={{ margin: '0 10px' }}>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-sm btn-secondary"
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}



