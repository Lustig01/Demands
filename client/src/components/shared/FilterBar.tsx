
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FilterListIcon from "@mui/icons-material/FilterList";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";

export interface FilterOption {
    value: string | number;
    label: string;
}

export interface FilterConfig {
    key: string;
    label: string;
    options: FilterOption[];
    value: string | number;
}

interface FilterBarProps {
    filters: FilterConfig[];
    onFilterChange: (key: string, value: string | number) => void;
    onClear: () => void;
}

export default function FilterBar({ filters, onFilterChange, onClear }: FilterBarProps) {
    const handleChange = (key: string) => (event: SelectChangeEvent) => {
        onFilterChange(key, event.target.value);
    };

    return (
        <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2, justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <FilterListIcon color="action" />
                    <Typography variant="subtitle2">סינון</Typography>
                </Box>
                <IconButton size="small" onClick={onClear} title="נקה סינון">
                    <ClearIcon fontSize="small" />
                </IconButton>
            </Box>
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {filters.map((filter) => (
                    <FormControl key={filter.key} size="small" sx={{ minWidth: 140 }}>
                        <InputLabel id={`filter-${filter.key}-label`}>{filter.label}</InputLabel>
                        <Select
                            labelId={`filter-${filter.key}-label`}
                            id={`filter-${filter.key}`}
                            value={String(filter.value)}
                            label={filter.label}
                            onChange={handleChange(filter.key)}
                        >
                            <MenuItem value="">
                                <em>הכל</em>
                            </MenuItem>
                            {filter.options.map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ))}
            </Box>
        </Paper>
    );
}
