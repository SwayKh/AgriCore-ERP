import React, { useState, useEffect, useContext } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  TextField, Button, Box
} from '@mui/material';
import { useCrops } from '../../../context/CropsContext';
import { InventoryContext } from '../../../context/InventoryContext';

const CropDialog = ({ open, onClose, editingCrop }) => {
  const { addCrop, updateCrop } = useCrops();
  const { inventory } = useContext(InventoryContext); // To select consumed resources

  const [crop, setCrop] = useState({
    cropName: '',
    variety: '',
    plantingDate: '',
    expectedHarvestDate: '',
    fieldLocation: '',
    status: 'Planted', // Default status
  });

  // State for managing consumed resources
  const [consumedResources, setConsumedResources] = useState([{ itemId: '', quantity: '' }]);

  useEffect(() => {
    if (editingCrop) {
      setCrop({
        cropName: editingCrop.cropName,
        variety: editingCrop.variety,
        plantingDate: new Date(editingCrop.plantingDate).toISOString().split('T')[0],
        expectedHarvestDate: new Date(editingCrop.expectedHarvestDate).toISOString().split('T')[0],
        fieldLocation: editingCrop.fieldLocation,
        status: editingCrop.status,
      });
      // Note: For simplicity, we are not loading consumed resources on edit yet.
      // This would require the backend to provide this data.
      setConsumedResources([{ itemId: '', quantity: '' }]);
    } else {
      // Reset to default for adding a new crop
      setCrop({
        cropName: '',
        variety: '',
        plantingDate: '',
        expectedHarvestDate: '',
        fieldLocation: '',
        status: 'Planted',
      });
      setConsumedResources([{ itemId: '', quantity: '' }]);
    }
  }, [editingCrop, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCrop(prev => ({ ...prev, [name]: value }));
  };

  const handleResourceChange = (index, e) => {
    const { name, value } = e.target;
    const updatedResources = [...consumedResources];
    updatedResources[index][name] = value;
    setConsumedResources(updatedResources);
  };

  const handleAddResource = () => {
    setConsumedResources([...consumedResources, { itemId: '', quantity: '' }]);
  };

  const handleRemoveResource = (index) => {
    const updatedResources = consumedResources.filter((_, i) => i !== index);
    setConsumedResources(updatedResources);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...crop, consumedResources };
    if (editingCrop) {
      updateCrop(editingCrop._id, payload);
    } else {
      addCrop(payload);
    }
    onClose();
  };

  // Filter inventory for items that can be consumed (e.g., seeds, fertilizers)
  const consumableInventory = inventory.filter(item => 
    ['Seeds', 'Fertilizers', 'Pesticides'].includes(item.category)
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{editingCrop ? 'Edit Crop' : 'Add New Crop'}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            name="cropName"
            label="Crop Name"
            value={crop.cropName}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="variety"
            label="Variety"
            value={crop.variety}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="plantingDate"
            label="Planting Date"
            type="date"
            value={crop.plantingDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            name="expectedHarvestDate"
            label="Expected Harvest Date"
            type="date"
            value={crop.expectedHarvestDate}
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            required
          />
          <TextField
            name="fieldLocation"
            label="Field Location"
            value={crop.fieldLocation}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          
          {/* Consumed Resources Section - Only for adding new crops for now */}
          {!editingCrop && (
            <Box sx={{ mt: 2, mb: 1 }}>
              <DialogTitle sx={{ p: 0, mb: 1 }}>Consumed Resources</DialogTitle>
              {consumedResources.map((resource, index) => (
                <Box key={index} sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                  <TextField
                    select
                    name="itemId"
                    label="Inventory Item"
                    value={resource.itemId}
                    onChange={(e) => handleResourceChange(index, e)}
                    fullWidth
                    SelectProps={{ native: true }}
                  >
                    <option value=""></option>
                    {consumableInventory.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.quantity} {item.unit})
                      </option>
                    ))}
                  </TextField>
                  <TextField
                    name="quantity"
                    label="Quantity Used"
                    type="number"
                    value={resource.quantity}
                    onChange={(e) => handleResourceChange(index, e)}
                    sx={{ width: '150px' }}
                  />
                  <Button onClick={() => handleRemoveResource(index)} color="secondary" size="small">
                    Remove
                  </Button>
                </Box>
              ))}
              <Button onClick={handleAddResource} size="small">
                Add Resource
              </Button>
            </Box>
          )}

        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit} variant="contained">
          {editingCrop ? 'Save Changes' : 'Save Crop'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CropDialog;
