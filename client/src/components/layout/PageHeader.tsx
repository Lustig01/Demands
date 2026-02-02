import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import type { ComponentType } from 'react';
import type { SvgIconProps } from '@mui/material/SvgIcon';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ComponentType<SvgIconProps>;
}

export default function PageHeader({ title, subtitle, icon: Icon }: PageHeaderProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
      {Icon && <Icon sx={{ fontSize: 36, color: 'primary.main' }} />}
      <Box>
        <Typography variant="h5" fontWeight="bold">
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
