import React, { useState, useEffect, useRef } from 'react';
import './Manageusers.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import {
  Container,
  Row,
  Col,
  Button,
  Table,
  Navbar
} from 'react-bootstrap';

import {
  fetchAllUsers,
  deleteUser,
  // addUser // Uncomment if you still use this function directly in Manageusers, otherwise remove
} from './userService'; // Assuming userService.ts contains these
import CustomNavbar from './Navbar'; // Assuming CustomNavbar.tsx exists
import HotelManagementModal from './AdminAddHotel'; // Ensure this path is correct: AdminAddHotel.tsx
import AddUserModal from './AddUserModal'; // Assuming AddUserModal.tsx exists
import EditUserModalAdmin from './EditUserModalAdmin'; // Assuming EditUserModalAdmin.tsx exists
import Managehotels from './Managehotels'; // Import Managehotels component
import ManageHotelsHandle from './Managehotels'; // Import ManageHotelsHandle as a default export
import Managereviews from './Managereviews'; // Assuming Managereviews.tsx exists
import Footer from './Footer';

interface Role {
  roleId: number;
  roleName: string;
}

interface User {
  userId: number;
  name: string;
  email: string;
  roles: string | Role[];
  contactNumber: string;
}

type TabKey = 'users' | 'hotels' | 'reviews';

const navItems = [
  { key: 'users' as TabKey, icon: 'fas fa-users', label: 'Manage Users' },
  { key: 'hotels' as TabKey, icon: 'fas fa-hotel', label: 'Manage Hotels' },
  { key: 'reviews' as TabKey, icon: 'fas fa-star', label: 'Manage Reviews' }
];

const Manageusers: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [showAddHotelModal, setShowAddHotelModal] = useState(false); // State for HotelManagementModal

  // Ref for Managehotels component to call its methods
  // const manageHotelsRef = useRef<ManageHotelsHandle>(null);

  // Load users on initial render and when users data changes (e.g., after add/edit/delete)
  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []); // Empty dependency array means it runs once on mount

  const handleDelete = async (userId: number) => {
    const confirmed = window.confirm(`Are you sure you want to permanently remove the user with ID ${userId}?`);
    if (!confirmed) return;

    try {
      const message = await deleteUser(userId);
      alert(message);
      setUsers(prev => prev.filter(user => user.userId !== userId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user.");
    }
  };

  const handleEdit = (u: User) => {
    const roleName =
      Array.isArray(u.roles) && u.roles.length > 0
        ? u.roles[0].roleName
        : typeof u.roles === 'string'
          ? u.roles
          : 'GUEST';

    setSelectedUser({
      userId: u.userId,
      name: u.name,
      email: u.email,
      contactNumber: parseInt(u.contactNumber),
      roleName
    });

    setShowEditModal(true);
  };

  //  Callback function to refresh hotels after a hotel is added/updated
  const handleHotelAddedOrUpdated = () => {
    // if (manageHotelsRef.current) {
    //   manageHotelsRef.current.fetchHotels(); // Call the fetchHotels method on the Managehotels component
    // }
  };

  const renderContent = () => {
    if (activeTab === 'users') {
      return (
        <>
        
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-3">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-3">No users found.</td>
                </tr>
              ) : (
                users.map(u => (
                  <tr key={u.userId}>
                    <td>{u.userId}</td>
                    <td>{u.name}</td>
                    <td className="plain-email">
                      <i className="fas fa-envelope me-1"></i>{u.email}
                    </td>
                    <td>
                      {Array.isArray(u.roles)
                        ? u.roles.map(r => r.roleName).join(', ')
                        : u.roles}
                    </td>
                    <td>{u.contactNumber}</td>
                    <td>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="action-btn"
                        onClick={() => handleEdit(u)}
                      >
                        <i className="fas fa-pencil-alt"></i>
                      </Button>{' '}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(u.userId)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {showEditModal && selectedUser && (
            <EditUserModalAdmin
              show={showEditModal}
              onHide={() => setShowEditModal(false)}
              userData={selectedUser}
              onUpdate={(updatedUser) => {
                setUsers(prev =>
                  prev.map(user =>
                    user.userId === updatedUser.userId ? updatedUser : user
                  )
                );
                setShowEditModal(false); // Close modal after update
              }}
            />
          )}

          {showAddModal && (
            <AddUserModal
              show={showAddModal}
              onHide={() => setShowAddModal(false)}
              onAdd={(newUser) => {
                setUsers(prev => [...prev, newUser]);
                setShowAddModal(false); // Close modal after add
              }}
            />
          )}
        </>
      );
    }

    if (activeTab === 'hotels') {
      return <Managehotels/>;
    }

    if (activeTab === 'reviews') {
      return <Managereviews />;
    }
    return null;
  };

  return (
    <div>
      <CustomNavbar />
      <div style={{ height: "100vh" }}>
        <Navbar bg="dark" variant="dark" className="d-md-none px-3 py-2">
          <Navbar.Brand>
            {activeTab === 'users' ? 'Users' : activeTab === 'hotels' ? 'Hotels' : 'Reviews'}
          </Navbar.Brand>
        </Navbar>

        <Container fluid className="manage-users">
          <Row className="justify-content-center my-4 card-row">
            {navItems.map(item => (
              <Col xs={10} sm={6} md={4} key={item.key}>
                <div
                  className={`card-selector ${activeTab === item.key ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.key)}
                >
                  <i className={`${item.icon} fa-2x mb-2`}></i>
                  <h6>{item.label}</h6>
                </div>
              </Col>
            ))}
          </Row>

          <Row className="align-items-center header-row">
            <Col>
              <h4>
                {activeTab === 'users'
                  ? 'Users List'
                  : activeTab === 'hotels'
                    ? 'Hotels List'
                    : 'Reviews List'}
              </h4>
            </Col>
            {(activeTab === 'users' || activeTab === 'hotels') && (
              <Col className="text-end">
                <Button
                  className="add-btn"
                  onClick={() => {
                    if (activeTab === 'users') setShowAddModal(true);
                    else if (activeTab === 'hotels') {
                      setShowAddHotelModal(true); // This opens the Hotel Management Modal
                    }
                  }}
                >
                  <i className="fas fa-plus me-1"></i>
                  {activeTab === 'users' ? 'Add User' : 'Add Hotel'}
                </Button>
              </Col>
            )}
          </Row>

          {renderContent()}

          {/* Hotel Management Modal */}
          <HotelManagementModal
            show={showAddHotelModal}
            onHide={() => setShowAddHotelModal(false)}
            onHotelAdded={handleHotelAddedOrUpdated} //  Pass the callback here
          />
        </Container>
        <Footer />
      </div>
    </div>
    
  );
};

export default Manageusers;