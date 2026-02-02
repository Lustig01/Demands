import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function NotFoundPage() {
  return (
    <Box sx={{ textAlign: 'center', py: 8 }}>
      <Typography variant="h3" gutterBottom>
        404
      </Typography>
      <Typography color="text.secondary">העמוד המבוקש לא נמצא</Typography>
    </Box>
  );
}
