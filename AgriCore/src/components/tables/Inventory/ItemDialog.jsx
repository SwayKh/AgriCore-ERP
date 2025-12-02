import * as React from 'react';
import { useState, useEffect, useContext } from 'react';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle,
    Select, MenuItem, FormControl, InputLabel, Alert, FormHelperText
} from '@mui/material';
import { InventoryContext } from '../../../context/InventoryContext';

export default function ItemDialog({ open, onClose, onSave, item, itemError }) {
    const { categories } = useContext(InventoryContext);
    const [newItem, setNewItem] = useState({ itemName: '', quantity: '', price: '', categoryName: '' });
    const [localErrors, setLocalErrors] = useState({});

    useEffect(() => {
        if (open) {
            if (item) {
                // When editing, find the categoryName from the categories list using item.category (the ID)
                const categoryObj = categories.find(cat => cat._id === item.category);
                setNewItem({
                    _id: item._id || '',
                    itemName: item.itemName || '',
                    quantity: item.quantity || '',
                    price: item.price || '',
                    categoryName: categoryObj ? categoryObj.categoryName : '' // Set the categoryName string
                });
            } else {
                setNewItem({ itemName: '', quantity: '', price: '', categoryName: '' });
            }
            setLocalErrors({}); // Clear local errors when dialog opens
        }
    }, [item, open, categories]); // Add categories to dependency array

    const handleNewItemChange = (e) => {
        setNewItem({ ...newItem, [e.target.name]: e.target.value });
        setLocalErrors(prevErrors => ({ ...prevErrors, [e.target.name]: undefined })); // Clear error for the field being edited
    };

    const handleSave = async () => {
        let errors = {};

        if (!newItem.itemName) {
            errors.itemName = "Item Name is required.";
        }
        if (!newItem.quantity) {
            errors.quantity = "Quantity is required.";
        }
        else if (parseInt(newItem.quantity, 10) <= 0) {
            errors.quantity = "Quantity must be a positive number.";
        }
        if (!newItem.price) {
            errors.price = "Price is required.";
        }
        else if (parseFloat(newItem.price) <= 0) {
            errors.price = "Price must be a positive number.";
        }
        if (!newItem.categoryName) {
            errors.categoryName = "Category is required.";
        }
        else {
            const selectedCategory = categories.find(cat => cat.categoryName === newItem.categoryName);
            if (!selectedCategory) {
                errors.categoryName = "Selected category is invalid.";
            }
        }

        if (Object.keys(errors).length > 0) {
            setLocalErrors(errors);
            return false; // Indicate validation failure
        }

        setLocalErrors({}); // Clear all errors if validation passes

        // Find the category ID based on the selected categoryName
        const selectedCategory = categories.find(cat => cat.categoryName === newItem.categoryName);
        // selectedCategory check is already done in validation, so no need to re-check here.

        let itemDataToSend = {
            itemName: newItem.itemName,
            quantity: parseInt(newItem.quantity, 10), // Ensure quantity is a number
            price: parseFloat(newItem.price), // Ensure price is a number
            categoryName: newItem.categoryName, // Use categoryName instead of category ID
        };

        if (newItem._id) { // Only include _id if it exists (i.e., we are editing an existing item)
            itemDataToSend._id = newItem._id;
        }
        const success = await onSave(itemDataToSend);
        if (success) {
            onClose(); // Close the dialog only if saving was successful
        }
        return success; // Return true/false based on onSave outcome
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
            <DialogContent>

                {itemError && <Alert severity="error" sx={{ mb: 2 }}>{itemError}</Alert>}
                <TextField
                    autoFocus
                    margin="dense"
                    name="itemName"
                    label="Item Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newItem.itemName}
                    onChange={handleNewItemChange}
                    error={!!localErrors.itemName}
                    helperText={localErrors.itemName}
                />
                <TextField
                    margin="dense"
                    name="quantity"
                    label="Quantity"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={newItem.quantity}
                    onChange={handleNewItemChange}
                    error={!!localErrors.quantity}
                    helperText={localErrors.quantity}
                />
                <TextField
                    margin="dense"
                    name="price"
                    label="Price"
                    type="number"
                    fullWidth
                    variant="standard"
                    value={newItem.price}
                    onChange={handleNewItemChange}
                    error={!!localErrors.price}
                    helperText={localErrors.price}
                />
                <FormControl fullWidth margin="dense" error={!!localErrors.categoryName}>
                    <InputLabel>Category</InputLabel>
                    <Select
                        name="categoryName" // <-- Name is correct for backend
                        value={newItem.categoryName} // <-- Now holds the categoryName string
                        onChange={handleNewItemChange}
                    >
                        {categories.map(cat => (
                            <MenuItem key={cat._id} value={cat.categoryName}>{cat.categoryName}</MenuItem> //* <-- MenuItem value is categoryName string */}
                        ))}
                    </Select>
                    {!!localErrors.categoryName && <FormHelperText>{localErrors.categoryName}</FormHelperText>}
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>{item ? 'Save' : 'Add'}</Button>
            </DialogActions>
        </Dialog>
    );
}


