import axios from 'axios';

const BASE_URL = 'http://localhost:9999/user-api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('accessToken');
  if (!token || !token.includes('.')) {
    throw new Error('Invalid or missing JWT token');
  }
  return {
    Authorization: `Bearer ${token}`
  };
};

export const fetchAllUsers = async () => {
  const response = await axios.get(`${BASE_URL}/allusers`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteUser = async (userId: number): Promise<string> => {
  const response = await axios.delete(`${BASE_URL}/users/${userId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

//  Updated to support role preservation
export const updateUser = async (payload: {
  userId: number;
  name: string;
  email: string;
  contactNumber: number;
  roles: { roleName: string }[]; //  added field
}) => {
  const response = await axios.put(`${BASE_URL}/users`, payload, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const addUser = async (payload: {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  roles: { roleName: string }[];
}) => {
  const response = await axios.post(`${BASE_URL}/users`, payload, {
    headers: getAuthHeaders()
  });
  return response.data;
};
