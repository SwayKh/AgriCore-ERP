import React, { useContext, useMemo } from 'react';
import { Card, CardContent, Typography, List, ListItem, ListItemText, Box, CircularProgress } from '@mui/material';
// import { CropsContext } from '../../../context/CropsContext';
import { CropsContext } from '../context/CropsContext';

export default function CropSummary() {
    const { crops, loading, error } = useContext(CropsContext);

    const cropStatusSummary = useMemo(() => {
        const summary = {};
        crops.forEach(crop => {
            summary[crop.status] = (summary[crop.status] || 0) + 1;
        });
        return summary;
    }, [crops]);

    if (loading) {
        return (
            <Card>
                <CardContent>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                        <CircularProgress />
                    </Box>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <Typography color="error">Error: {error}</Typography>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Crop Status Summary
                </Typography>
                <List dense>
                    {Object.keys(cropStatusSummary).length > 0 ? (
                        Object.entries(cropStatusSummary).map(([status, count]) => (
                            <ListItem key={status}>
                                <ListItemText primary={`${status}: ${count} crops`} />
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No crop data available." />
                        </ListItem>
                    )}
                </List>
            </CardContent>
        </Card>
    );
}
