import React from "react";
import { TableRow as MuiTableRow, TableCell, Button, TextField } from "@mui/material";
import type { EditableTableData, TableDataKeys } from "../../types/types";
import { formatDate } from "../../utils/dateFormating";

interface TableRowProps {
	row: EditableTableData;
	onEdit: () => void;
	onDelete: () => void;
	onSave: () => void;
	onCancel: () => void;
	onChange: (field: any, value: string) => void;
}

const TableRow: React.FC<TableRowProps> = ({
	row,
	onEdit,
	onDelete,
	onSave,
	onCancel,
	onChange,
}) => {
	console.log(row);
	const renderCell = (field: TableDataKeys) => {
		const isDateField = field === "companySigDate" || field === "employeeSigDate";
		if (row.isEditing) {
			return (
				<TableCell style={{ padding: "0" }}>
					<TextField
						size="small"
						type={isDateField ? "datetime-local" : "text"}
						value={isDateField ? row[field].slice(0, 16) : row[field]}
						onChange={(e) => onChange(field as TableDataKeys, e.target.value)}
						sx={{
							"& .MuiInputBase-input": {
								fontSize: "14px",
								padding: "0px",
								paddingLeft: "16px",
								height: "20px",
								width: isDateField ? "150px" : "100px",
							},
						}}
					/>
				</TableCell>
			);
		}
		return <TableCell>{isDateField ? formatDate(row[field] as string) : row[field]}</TableCell>;
	};

	return (
		<MuiTableRow style={{ maxHeight: "50px", width: "100%" }}>
			{Object.keys(row)
				.filter((key) => key !== "id" && key !== "isEditing")
				.map((key) => renderCell(key as TableDataKeys))}
			<TableCell>
				{row.isEditing ? (
					<>
						<Button onClick={onSave}>Save</Button>
						<Button onClick={onCancel}>Cancel</Button>
					</>
				) : (
					<>
						<Button onClick={onEdit}>Edit</Button>
						<Button
							onClick={onDelete}
							color="error"
						>
							Delete
						</Button>
					</>
				)}
			</TableCell>
		</MuiTableRow>
	);
};

export default TableRow;
