// src/layout/TopNav.jsx
import { AppBar, Toolbar, Button, Container, Box, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

export default function TopNav() {
  const { pathname } = useLocation();
  const isActive = (path) => pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={2}
      sx={{
        borderRadius: 0,
        backgroundColor: 'primary.main',
      }}
    >
      <Container maxWidth="md">
        <Toolbar disableGutters sx={{ gap: 2, justifyContent: 'space-between' }}>
          {/* 👇 Brand / title on the left */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: 'none',
              color: '#fff',
              fontWeight: 600,
              letterSpacing: 0.5,
            }}
          >
            Youth Team Members
          </Typography>

          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              to="/"
              variant={isActive('/') ? 'contained' : 'text'}
              sx={{
                color: isActive('/') ? '#fff' : 'inherit',
                backgroundColor: isActive('/') ? 'primary.light' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive('/') ? 'primary.main' : 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Members
            </Button>

            <Button
              component={Link}
              to="/insights"
              variant={isActive('/insights') ? 'contained' : 'text'}
              sx={{
                color: isActive('/insights') ? '#fff' : 'inherit',
                backgroundColor: isActive('/insights') ? 'success.light' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive('/insights')
                    ? 'success.main'
                    : 'rgba(255,255,255,0.1)',
                },
              }}
            >
              Insights
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
