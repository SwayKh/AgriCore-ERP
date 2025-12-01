import React, { useState, useEffect, createContext, useContext } from 'react';

export const CropsContext = createContext();

export const useCrops = () => {
    return useContext(CropsContext);
};

export const CropsProvider = ({ children }) => {
    const [crops, setCrops] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCrops();
    }, []);

    const fetchCrops = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8000/api/v1/crop/getCrops', { credentials: 'include' });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch crops');
            }
            const result = await response.json();
            if (result.success && Array.isArray(result.data)) {
                setCrops(result.data);
            } else {
                throw new Error('Unexpected response structure for crop data');
            }
        } catch (err) {
            setError(err.message);
            console.error("Failed to fetch crops", err);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        crops,
        loading,
        error,
        fetchCrops,
    };

    return (
        <CropsContext.Provider value={value}>
            {children}
        </CropsContext.Provider>
    );
};