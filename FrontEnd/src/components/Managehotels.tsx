import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { Table, Button } from 'react-bootstrap';
import axios from 'axios';
import './Managehotels.css';
import EditHotelModal from './EditHotelModal';

interface Hotel {
  hotelId: number;
  name: string;
  location: string;
  managerId: number | null;
  amenities: string;
  rating: number | null;
  url: string | null;
  minPrice?: number | null; // Keep in interface as it's part of the fetched data, just not displayed
}

export interface ManageHotelsHandle {
  fetchHotels: () => void;
}

const Managehotels = forwardRef<ManageHotelsHandle, {}>( (props, ref) => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditHotelModal, setShowEditHotelModal] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8083/api/hotels/all');
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    fetchHotels
  }));

  useEffect(() => {
    fetchHotels();
  }, []);

  const deleteHotel = async (hotelId: number) => {
    const confirmed = window.confirm(`Are you sure you want to delete hotel ID ${hotelId}?`);
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8083/api/hotels/delete/${hotelId}`);
      setHotels(prev => prev.filter(h => h.hotelId !== hotelId));
      alert(`Hotel ID ${hotelId} deleted successfully.`);
    } catch (error) {
      console.error(`Error deleting hotel ${hotelId}:`, error);
      alert(`Failed to delete hotel ID ${hotelId}.`);
    }
  };

  const handleEdit = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    setShowEditHotelModal(true);
  };

  const handleHotelUpdate = (updatedHotel: Hotel) => {
    // When a hotel is updated, we get the updated hotel object back.
    // We need to ensure we keep the minPrice from the original if it wasn't editable,
    // or if the backend sends it back. For this scenario, the backend should ideally
    // preserve the minPrice if the frontend doesn't send it.
    // To be safe, let's refresh the entire list to get the latest data,
    // or merge the updated fields if you prefer not to re-fetch everything.
    // For simplicity and guaranteed freshness, triggering a full fetch is robust.
    fetchHotels(); // Re-fetch all hotels to ensure data consistency
    setShowEditHotelModal(false);
  };

  return (
    <div id="list-of-hotels" className="table-responsive">
      <Table bordered hover responsive>
        <thead className="table-light">
          <tr>
            <th>Hotel Id</th>
            <th>Name</th>
            <th>Location</th>
            <th>Manager Id</th>
            <th>Amenities</th>
            <th>Action</th> {/*  Price column removed here */}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              {/*  colSpan reduced to 6 (from 7) */}
              <td colSpan={6} className="text-center py-3">Loading hotels...</td>
            </tr>
          ) : hotels.length === 0 ? (
            <tr>
              {/*  colSpan reduced to 6 (from 7) */}
              <td colSpan={6} className="text-center py-3">No hotels found.</td>
            </tr>
          ) : (
            hotels.map(h => (
              <tr key={h.hotelId}>
                <td data-label="Hotel Id">{h.hotelId}</td>
                <td data-label="Name">{h.name}</td>
                <td data-label="Location">{h.location}</td>
                <td data-label="Manager Id">{h.managerId === null ? 'N/A' : h.managerId}</td>
                <td data-label="Amenities">{h.amenities || 'N/A'}</td>
                {/*  Price data row removed here */}
                <td data-label="Action" className="hotel-action-icons">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="action-btn me-2"
                    onClick={() => handleEdit(h)}
                  >
                    <i className="fas fa-pencil-alt"></i>
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => deleteHotel(h.hotelId)}
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>

      {showEditHotelModal && selectedHotel && (
        <EditHotelModal
          show={showEditHotelModal}
          onHide={() => setShowEditHotelModal(false)}
          hotelData={selectedHotel}
          onUpdate={handleHotelUpdate}
        />
      )}
    </div>
  );
});

export default Managehotels;