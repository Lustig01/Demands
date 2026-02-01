import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import CircularProgress from "@mui/material/CircularProgress";
import type { SettingsInput } from "../../../api/types";
import SearchInput from "../../shared/SearchInput";
import ConfirmDialog from "../../shared/ConfirmDialog";

interface SettingsFields {
  name: string;
  displayName: string | null;
  sortOrder: number;
  isActive: boolean;
}

interface SettingsTabProps<T extends SettingsFields> {
  title: string;
  data: T[];
  isLoading: boolean;
  onCreate: (data: SettingsInput) => Promise<unknown>;
  onUpdate: (params: { name: string; data: SettingsInput }) => Promise<unknown>;
  onDelete: (name: string) => Promise<unknown>;
}

export default function SettingsTab<T extends SettingsFields>({
  title,
  data,
  isLoading,
  onCreate,
  onUpdate,
  onDelete,
}: SettingsTabProps<T>) {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [search, setSearch] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const filteredData = data.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      (item.displayName && item.displayName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreate = async () => {
    if (!name.trim()) return;
    await onCreate({
      name: name.trim(),
      displayName: displayName.trim() || undefined,
      sortOrder,
    });
    setName("");
    setDisplayName("");
    setSortOrder(0);
  };

  const handleToggleActive = async (item: T) => {
    await onUpdate({
      name: item.name,
      data: { name: item.name, isActive: !item.isActive },
    });
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await onDelete(deleteTarget);
      setDeleteTarget(null);
    }
  };

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom>
          + הוספת {title}
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end", flexWrap: "wrap" }}>
          <TextField
            label="סדר מיון"
            type="number"
            size="small"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            sx={{ width: 100 }}
          />
          <TextField
            label="שם תצוגה"
            size="small"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="שם להצגה"
            sx={{ width: 200 }}
          />
          <TextField
            label="ערך (מזהה) *"
            size="small"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="english_key"
            sx={{ width: 200 }}
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleCreate} disabled={!name.trim()}>
            הוסף
          </Button>
        </Box>
      </Paper>

      <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 2 }}>
        <SearchInput value={search} onChange={setSearch} />
      </Box>

      {isLoading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>ערך</TableCell>
                <TableCell>שם תצוגה</TableCell>
                <TableCell>סדר</TableCell>
                <TableCell>פעיל</TableCell>
                <TableCell>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                      אין נתונים להצגה
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item) => (
                  <TableRow key={item.name}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.displayName || "-"}</TableCell>
                    <TableCell>{item.sortOrder}</TableCell>
                    <TableCell>
                      <Switch checked={item.isActive} onChange={() => handleToggleActive(item)} size="small" />
                    </TableCell>
                    <TableCell>
                      <IconButton size="small" color="error" onClick={() => setDeleteTarget(item.name)}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        title="מחיקת רשומה"
        message={`האם למחוק את "${deleteTarget}"?`}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </Box>
  );
}
