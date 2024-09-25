import React from "react";
import { Table, TableBody, TableContainer, Paper, Button, CircularProgress } from "@mui/material";
import { DataTableProps } from "../../types/types";
import { useTableData } from "../../hooks/useTableData";
import { useRowActions } from "../../hooks/useRowActions";
import TableRow from "./TableRow";
import TableSkeleton from "./TableSkeleton";
import TableHeader from "./TableHeader";
import ConfirmDialog from "../ConfirmDialog";
import { useEditableRows } from "../../hooks/useEditableRows";
import { useDeleteConfirmation } from "../../hooks/useDeleteConfirmation";

const DataTable: React.FC<DataTableProps> = ({ token, setIsSubmitting }) => {
	const { data, isLoading, addRow, updateRow, deleteRow } = useTableData(token);
	const { handleSubmitRow, handleDeleteRow } = useRowActions(
		token,
		addRow,
		updateRow,
		deleteRow,
		setIsSubmitting
	);

		const {
			editableData,
			newRow,
			setNewRow,
			setEditingId,
			handleAddRow,
			handleChangeRow,
			handleSaveRow,
			handleSaveNewRow,
		} = useEditableRows(data, handleSubmitRow, updateRow);
	
		const {
			confirmDialogOpen,
			openDeleteDialog,
			confirmDelete,
			cancelDelete,
		} = useDeleteConfirmation(handleDeleteRow);
	

	return (
		<TableContainer
			component={Paper}
		>
			
			<Table>
				<TableHeader />
				<TableBody>
					{isLoading ? (
						<TableSkeleton />
					) : (
						editableData.map((row) => (
							<TableRow
								key={row.id}
								row={row}
								onEdit={() => setEditingId(row.id!)}
								onDelete={() => openDeleteDialog(row.id!)}
								onSave={() => {
									handleSaveRow(row, false);
								}}
								onCancel={() => setEditingId(null)}
								onChange={(field, value) => handleChangeRow(row.id!, field, value)}
							/>
						))
					)}
					{newRow && (
						<TableRow
							row={{ ...newRow, id: "new", isEditing: true }}
							onEdit={() => {}}
							onDelete={() => {}}
							onSave={handleSaveNewRow}
							onCancel={() => setNewRow(null)}
							onChange={(field, value) => handleChangeRow("new", field, value)}
						/>
					)}
				</TableBody>
			</Table>
			<Button
				onClick={handleAddRow}
				style={{ marginTop: "16px" }}
			>
				Add Record
			</Button>
			

			<ConfirmDialog
        open={confirmDialogOpen}
        title="Confirm Deletion"
        content="Are you sure you want to delete this row?"
        onConfirm={confirmDelete}  
        onCancel={cancelDelete}    
      />
		</TableContainer>
	);
};

export default DataTable;
