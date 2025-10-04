import { Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import TopNav from './layout/TopNav';
import Members from './pages/Members';
import BirthdayInsights from './pages/BirthdayInsights';

export default function App() {
  return (
    <>
      <TopNav />
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Routes>
          <Route path="/" element={<Members />} />
          <Route path="/insights" element={<BirthdayInsights />} />
        </Routes>
      </Container>
    </>
  );
}
