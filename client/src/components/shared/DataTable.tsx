
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
} from "@tanstack/react-table";
import { useState, useMemo, useEffect } from "react";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TablePagination from "@mui/material/TablePagination";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import TableSortLabel from "@mui/material/TableSortLabel";

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  isLoading?: boolean;
  enableSelection?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  getRowId?: (row: T) => string;
}

export default function DataTable<T>({
  data,
  columns,
  isLoading = false,
  enableSelection = false,
  onSelectionChange,
  getRowId = (row: any) => row.id,
}: DataTableProps<T>) {
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const finalColumns = useMemo(() => {
    if (enableSelection) {
      const selectionColumn: ColumnDef<T> = {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            indeterminate={table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()}
            onChange={(event) => table.toggleAllPageRowsSelected(!!event.target.checked)}
            inputProps={{ "aria-label": "select all rows" }}
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={(event) => row.toggleSelected(!!event.target.checked)}
            inputProps={{ "aria-label": "select row" }}
          />
        ),
        enableSorting: false,
        size: 50, // Removed CheckboxSize here as it's not a valid prop on ColumnDef, size is number
      };
      return [selectionColumn, ...columns];
    }
    return columns;
  }, [columns, enableSelection]);

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: {
      rowSelection,
      sorting,
      pagination,
    },
    onRowSelectionChange: (updater) => {
      setRowSelection(updater);
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId,
  });

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Object.keys(rowSelection));
    }
  }, [rowSelection, onSelectionChange]);

  if (isLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper variant="outlined" sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader size="small">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    sortDirection={header.column.getIsSorted() as "asc" | "desc" | false}
                    sx={{ fontWeight: "bold", bgcolor: "background.paper" }}
                    width={header.column.getSize() !== 150 ? header.column.getSize() : undefined}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort() ? "cursor-pointer select-none" : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && (
                          <TableSortLabel
                            active={!!header.column.getIsSorted()}
                            direction={header.column.getIsSorted() as "asc" | "desc"}
                            onClick={header.column.getToggleSortingHandler()}
                          />
                        )}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={finalColumns.length} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">אין נתונים להצגה</Typography>
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} hover selected={row.getIsSelected()}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 50, 100]}
        component="div"
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={pagination.pageSize}
        page={pagination.pageIndex}
        onPageChange={(_, page) => table.setPageIndex(page)}
        onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
        labelRowsPerPage="שורות בעמוד:"
        labelDisplayedRows={({ from, to, count }) => `מציג ${from}-${to} מתוך ${count} רשומות`}
      />
    </Paper>
  );
}
