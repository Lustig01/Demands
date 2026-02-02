import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <Box className="not-found">
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography color="text.secondary">העמוד המבוקש לא נמצא</Typography>
    </Box>
  );
}
