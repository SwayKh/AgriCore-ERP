import React from 'react';
import { Grid, Card, CardContent, Typography } from '@mui/material';
import CropSummary from './CropSummary'; // Import the CropSummary component

export default function Dashboard() {
    return (
        <div>
            <Typography variant="h4" gutterBottom>
                AgriCore Dashboard
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6} lg={4}>
                    <CropSummary />
                </Grid>
                {/* Placeholder Cards */}
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Inventory</Typography>
                            <Typography variant="body2">Low stock items: 5</Typography>
                            <Typography variant="body2">Total items: 100</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Livestock</Typography>
                            <Typography variant="body2"> Cattle: 50
                            </Typography>
                            <Typography variant="body2">Poultry: 200</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6">Finance</Typography>
                            <Typography variant="body2">Recent Income: $5,000</Typography>
                            <Typography variant="body2">Recent Expenses: $2,000</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </div>
    );
}
