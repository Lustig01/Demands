import type { ReactNode } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

interface SummaryCardItem {
  label: string;
  value: number | string;
  color?: string;
  icon?: ReactNode;
}

interface SummaryCardsProps {
  items: SummaryCardItem[];
}

export default function SummaryCards({ items }: SummaryCardsProps) {
  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
      {items.map((item) => (
        <Card
          key={item.label}
          variant="outlined"
          sx={{
            flex: "1 1 0",
            minWidth: 140,
            bgcolor: item.color ? `${item.color}` : undefined,
          }}
        >
          <CardContent sx={{ textAlign: "center", py: 2, "&:last-child": { pb: 2 } }}>
            {item.icon && <Box sx={{ mb: 0.5 }}>{item.icon}</Box>}
            <Typography variant="h4" fontWeight={700}>
              {item.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.label}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
