import React from 'react';
import Typography from '@material-ui/core/Typography';
import Title from './Title';

export default function PrizeTotal() {
  return (
    <React.Fragment>
      <Title>Total Prizes</Title>
      <Typography component="p" variant="h4">
        40
      </Typography>

    </React.Fragment>
  );
}
