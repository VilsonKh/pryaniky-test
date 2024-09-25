import { useState, useCallback } from "react";
import { TableData } from "../types/types";
import { api } from "../api";

export const useRowActions = (
	token: string,
	addRow: (row: TableData) => void,
	updateRow: (row: TableData) => void,
	deleteRow: (id: string) => void,
  setIsSubmitting: (isSubmitting: boolean) => void
) => {

	const handleSubmitRow = useCallback(
		async (row: TableData, isNew: boolean) => {
			if (Object.values(row).every((field) => field !== "")) {
				setIsSubmitting(true);
				try {
					const submittedRow = await api.submitRow(token, row, isNew);
					isNew ? addRow(submittedRow) : updateRow(submittedRow);
          return true
				} catch (error) {
					console.error(`Error ${isNew ? "adding" : "updating"} record:`, error);
				} finally {
					setIsSubmitting(false);
				}
			} else {
				alert("Please fill in all fields.");
        return false
			}
      return false
		},
		[token, addRow, updateRow]
	);

	const handleDeleteRow = useCallback(
		async (id: string) => {
			setIsSubmitting(true);
			try {
				await api.deleteRow(token, id);
				deleteRow(id);
			} catch (error) {
				console.error("Error deleting item:", error);
			}
			setIsSubmitting(false);
		},
		[token, deleteRow]
	);

	return { handleSubmitRow, handleDeleteRow };
};
