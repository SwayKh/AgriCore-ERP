import React, { createContext, useState, useContext } from 'react';

// Mock Data - Replace with API call
const mockCrops = [
  {
    _id: 'crop001',
    cropName: 'Winter Wheat',
    variety: 'Hard Red',
    plantingDate: '2025-09-15',
    expectedHarvestDate: '2026-06-20',
    fieldLocation: 'North Field 2',
    status: 'Growing',
  },
  {
    _id: 'crop002',
    cropName: 'Corn',
    variety: 'Yellow Dent',
    plantingDate: '2025-10-02',
    expectedHarvestDate: '2026-02-15',
    fieldLocation: 'South Field 1',
    status: 'Planted',
  },
];

// 1. Create Context
const CropsContext = createContext();

// 2. Create a hook for easy consumption
export const useCrops = () => {
  return useContext(CropsContext);
};

// 3. Create Provider Component
export const CropsProvider = ({ children }) => {
  const [crops, setCrops] = useState(mockCrops);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- API Functions ---

  // Fetch all crops (currently uses mock data)
  const fetchCrops = async () => {
    setLoading(true);
    try {
      // In the future, this will be an API call:
      // const response = await fetch('/api/v1/crops');
      // const data = await response.json();
      // setCrops(data.data);
      console.log('Fetching crops...');
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setCrops(mockCrops);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch crops", err);
    } finally {
      setLoading(false);
    }
  };

  // Add a new crop
  const addCrop = async (cropData) => {
    setLoading(true);
    try {
      // In the future, this will be a POST request
      console.log('Adding new crop:', cropData);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      const newCrop = { ...cropData, _id: `crop${Date.now()}` }; // Mock ID
      setCrops(prevCrops => [newCrop, ...prevCrops]);
    } catch (err) {
      setError(err.message);
      console.error("Failed to add crop", err);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing crop
  const updateCrop = async (cropId, updatedData) => {
    setLoading(true);
    try {
      // In the future, this will be a PATCH request
      console.log(`Updating crop ${cropId}:`, updatedData);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setCrops(prevCrops =>
        prevCrops.map(crop =>
          crop._id === cropId ? { ...crop, ...updatedData } : crop
        )
      );
    } catch (err) {
      setError(err.message);
      console.error("Failed to update crop", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete a crop
  const deleteCrop = async (cropId) => {
    setLoading(true);
    try {
      // In the future, this will be a DELETE request
      console.log(`Deleting crop ${cropId}`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
      setCrops(prevCrops => prevCrops.filter(crop => crop._id !== cropId));
    } catch (err) {
      setError(err.message);
      console.error("Failed to delete crop", err);
    } finally {
      setLoading(false);
    }
  };


  const value = {
    crops,
    loading,
    error,
    fetchCrops,
    addCrop,
    updateCrop,
    deleteCrop,
  };

  return (
    <CropsContext.Provider value={value}>
      {children}
    </CropsContext.Provider>
  );
};
