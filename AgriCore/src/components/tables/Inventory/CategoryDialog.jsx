import * as React from 'react';
import { useState, useEffect } from 'react';
import {
    Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle, Alert
} from '@mui/material';

export default function CategoryDialog({ open, onClose, onSave, categoryError }) {
    const [newCategory, setNewCategory] = useState({ categoryName: '', unit: '' });
    const [localError, setLocalError] = useState(null);

    useEffect(() => {
        if (open) {
            setNewCategory({ categoryName: '', unit: '' });
            setLocalError(null); // Clear local error when dialog opens
        }
    }, [open]);

    const handleNewCategoryChange = (e) => {
        setNewCategory({ ...newCategory, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setLocalError(null); // Clear previous errors before attempting save
        if (!newCategory.categoryName || !newCategory.unit) {
            setLocalError("Category Name and Unit are required.");
            return;
        }
        const success = await onSave(newCategory);
        if (success) {
            onClose(); // Close the dialog only if saving was successful
        } else {
            // Error message will be set by the context and passed down via categoryError
            // or if there is a local validation error
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogContent>
                {localError && <Alert severity="error" sx={{ mb: 2 }}>{localError}</Alert>}
                {categoryError && <Alert severity="error" sx={{ mb: 2 }}>{categoryError}</Alert>}
                <TextField
                    autoFocus
                    margin="dense"
                    name="categoryName"
                    label="Category Name"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newCategory.categoryName}
                    onChange={handleNewCategoryChange}
                    error={!!localError && !newCategory.categoryName}
                    helperText={!!localError && !newCategory.categoryName ? "Category Name is required" : ""}
                />
                <TextField
                    margin="dense"
                    name="unit"
                    label="Unit"
                    type="text"
                    fullWidth
                    variant="standard"
                    value={newCategory.unit}
                    onChange={handleNewCategoryChange}
                    error={!!localError && !newCategory.unit}
                    helperText={!!localError && !newCategory.unit ? "Unit is required" : ""}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSave}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}
