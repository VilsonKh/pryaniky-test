import { useState, useMemo } from "react";
import { TableData, EditableTableData, TableDataKeys } from "../types/types";

export const useEditableRows = (
	data: TableData[],
	handleSubmitRow: (row: TableData, isNew: boolean) => Promise<boolean>,
	updateRow: (row: TableData) => void
) => {
	const [newRow, setNewRow] = useState<TableData | null>(null);
	const [editingId, setEditingId] = useState<string | null>(null);

	const editableData: EditableTableData[] = useMemo(
		() =>
			data.map((row) => ({
				...row,
				isEditing: row.id === editingId,
			})),
		[data, editingId]
	);

	const handleAddRow = () => {
		setNewRow({
			documentStatus: "",
			employeeNumber: "",
			documentType: "",
			documentName: "",
			employeeSignatureName: "",
			companySignatureName: "",
			employeeSigDate: new Date().toISOString(),
			companySigDate: new Date().toISOString(),
		});
	};

	const handleChangeRow = (id: string, field: keyof TableDataKeys, value: string) => {
		if (id === "new") {
			setNewRow((prev) => (prev ? { ...prev, [field]: value } : null));
		} else {
			updateRow({ ...data.find((row) => row.id === id)!, [field]: value });
		}
	};

	const handleSaveRow = async (row: TableData, isNew: boolean) => {
		const success = await handleSubmitRow(row, isNew);
		if (success) {
			setEditingId(null); 
		}
	};

	const handleSaveNewRow = async () => {
		const success = await handleSubmitRow(newRow!, true);
		if (success) {
			setNewRow(null); 
		}
	};

	return {
		editableData,
		newRow,
		setNewRow,
		editingId,
		setEditingId,
		handleAddRow,
		handleChangeRow,
		handleSaveRow,
		handleSaveNewRow,
	};
};
