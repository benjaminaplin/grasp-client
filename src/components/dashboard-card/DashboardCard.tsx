import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './dashboard-card.css'

type DashboardCardProps = { title: string, content: React.ReactNode, actions?: React.ReactNode }

export const DashboardCard = ({ title, content, actions }: DashboardCardProps) => {
  return (
    <Box className='dashboard-card-container' sx={{ minWidth: 275, marginBottom: '1rem', minHeight: '80px' }}>
      <Card variant="outlined" style={{
        height: '100%',
       
      }}>
        <React.Fragment>
          <CardContent style={{height: '100%',
         display: 'flex',
         flexDirection: 'column',
         justifyContent: 'space-around'}}>
            <Typography className='dashboard-card-title' align='center' variant='h4' gutterBottom>
              {title}
            </Typography>
              <div>
                {content}
              </div>
          </CardContent>
          {actions ? <CardActions> {actions} </CardActions> : null}
        </React.Fragment>
      </Card>
    </Box>
  );
}