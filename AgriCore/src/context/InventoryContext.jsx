import * as React from 'react';
import { useState, useEffect, createContext } from 'react';

export const InventoryContext = createContext();

const initialInventory = [
    { id: 1, name: 'Carrot Seeds', quantity: 100, price: 10, category: 'Seeds', seedVariety: 'Nantes', sowingSeason: 'Spring' },
    { id: 2, name: 'NPK Fertilizer', quantity: 50, price: 25, category: 'Fertilizers', composition: '10-10-10' },
    { id: 3, name: 'Neem Oil', quantity: 75, price: 15, category: 'Pesticides', toxicityLevel: 'Low' },
    { id: 4, name: 'Tomato Seeds', quantity: 120, price: 12, category: 'Seeds', seedVariety: 'Roma', sowingSeason: 'Spring' },
];

export const InventoryProvider = ({ children }) => {
    const [inventory, setInventory] = useState(() => {
        const savedInventory = localStorage.getItem('inventory');
        return savedInventory ? JSON.parse(savedInventory) : initialInventory;
    });
    const [categories, setCategories] = useState(() => {
        const savedCategories = localStorage.getItem('categories');
        return savedCategories ? JSON.parse(savedCategories) : ['Seeds', 'Fertilizers', 'Pesticides'];
    });
    const [categoryUnits, setCategoryUnits] = useState(() => {
        const savedCategoryUnits = localStorage.getItem('categoryUnits');
        return savedCategoryUnits ? JSON.parse(savedCategoryUnits) : { Seeds: 'kg', Fertilizers: 'kg', Pesticides: 'l' };
    });

    useEffect(() => {
        localStorage.setItem('inventory', JSON.stringify(inventory));
    }, [inventory]);

    useEffect(() => {
        localStorage.setItem('categories', JSON.stringify(categories));
    }, [categories]);

    useEffect(() => {
        localStorage.setItem('categoryUnits', JSON.stringify(categoryUnits));
    }, [categoryUnits]);

    const handleSaveItem = (itemToSave, editingItem) => {
        if (editingItem) {
            setInventory(inventory.map(item => item.id === editingItem.id ? itemToSave : item));
        } else {
            const newId = inventory.length > 0 ? Math.max(...inventory.map(item => item.id)) + 1 : 1;
            const itemToAdd = { ...itemToSave, id: newId };
            setInventory([...inventory, itemToAdd]);
        }
    };

    const handleDeleteItem = (id) => {
        setInventory(inventory.filter(item => item.id !== id));
    };

    const handleAddCategory = (newCategory, newCategoryUnit) => {
        if (newCategory && !categories.includes(newCategory)) {
            setCategories([...categories, newCategory]);
            setCategoryUnits({ ...categoryUnits, [newCategory]: newCategoryUnit });
        }
    };

    const updateInventoryQuantity = (itemId, quantityChange) => {
        setInventory(inventory.map(item =>
            item.id === itemId ? { ...item, quantity: item.quantity + quantityChange } : item
        ));
    };

    const value = {
        inventory,
        categories,
        categoryUnits,
        handleSaveItem,
        handleDeleteItem,
        handleAddCategory,
        updateInventoryQuantity,
        categorySpecificFields: {
            'Seeds': [
                { name: 'seedVariety', label: 'Seed Variety', type: 'text' },
                { name: 'sowingSeason', label: 'Sowing Season', type: 'text' },
            ],
            'Fertilizers': [
                { name: 'composition', label: 'Composition', type: 'text' },
            ],
            'Pesticides': [
                { name: 'toxicityLevel', label: 'Toxicity Level', type: 'text' },
            ]
        }
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};
