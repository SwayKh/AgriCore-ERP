import * as React from 'react';
import { Box, Typography } from '@mui/material';

const LivestockTable = () => {
    return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="textPrimary" gutterBottom>
                Livestock Management - Coming Soon!
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                Expected features: Track animal health, breeding cycles, feed management, and sales.
            </Typography>
        </Box>
    );
};

export default LivestockTable;
