import * as React from 'react';
import { Box, Typography } from '@mui/material';

const FinanceTable = () => {
    return (
        <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" color="textPrimary" gutterBottom>
                Finance Management - Coming Soon!
            </Typography>
            <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
                Expected features: Track income and expenses, generate financial reports, manage budgets.
            </Typography>
        </Box>
    );
};

export default FinanceTable;
