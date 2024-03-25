import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import './dashboard-card.css'
import { useNavigate } from 'react-router-dom';

type DashboardCardProps = { title: string, color?: string, content: React.ReactNode, actions?: React.ReactNode, destinationOnClick?: string}

export const DashboardCard = ({ title, content, actions , color, destinationOnClick}: DashboardCardProps) => {
  const navigate = useNavigate()
  return (
    <Box className='dashboard-card-container' sx={{ minWidth: 275, margin: '1rem 1rem 0 0', minHeight: '180px'}}>
      <Card variant="outlined" className='card-1-1' style={{
        height: '100%',
        backgroundColor: `var(--${color})`,
        cursor: 'pointer'
      }}>
        <React.Fragment>
          <CardContent  className='dashboard-card-content' onClick={() => destinationOnClick ? navigate(destinationOnClick) : null}>
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