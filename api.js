import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

axios.defaults.baseURL = process.env.API_URL;
axios.defaults.auth = {
  username: process.env.USER,
  password: process.env.PASS,
};

export const getClosestBranches = async (num, lat, long) => {
  const result = await axios.get(`/closeBranch?number=${num}&lat=${lat}&long=${long}`);
  if (result.status === 200) {
    return result.data;
  }

  return false;
};

export const getClosestATMs = async (num, lat, long) => {
  const result = await axios.get(`/closeATM?number=${num}&lat=${lat}&long=${long}`);
  if (result.status === 200) {
    return result.data;
  }

  return false;
};

export const updateFID = async (entityId, enitityType, fid) => {
  if (enitityType === 'b') {
    const result = await axios.post(`/CRUD/UPDATE/BRANCH?id=${entityId}&fid=${fid}`);
    if (result.status === 200) {
      return result.data;
    }
  } else if (enitityType === 'a') {
    const result = await axios.post(`/CRUD/UPDATE/ATM?id=${entityId}&fid=${fid}`);
    if (result.status === 200) {
      return result.data;
    }
  }

  return false;
};
