import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PageHeader from '../components/layout/PageHeader';

export default function DashboardPage() {
  return (
    <Box>
      <PageHeader
        title="לוח בקרה"
        subtitle="סקירה כללית של המערכת"
        icon={DashboardIcon}
      />
      <Typography color="text.secondary">תוכן העמוד יופיע כאן</Typography>
    </Box>
  );
}
