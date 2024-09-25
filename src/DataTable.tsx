import React, { useState, useEffect } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Skeleton,
	CircularProgress,
} from "@mui/material";
import axios from "axios";

interface TableData {
  id?: string;
	companySigDate: string;
	companySignatureName: string;
	documentName: string;
	documentStatus: string;
	documentType: string;
	employeeNumber: string;
	employeeSigDate: string;
	employeeSignatureName: string;
}

interface DataTableProps {
	token: string;
}

const DataTable: React.FC<DataTableProps> = ({ token }) => {
	const [data, setData] = useState<TableData[]>([]);
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
	const [currentItem, setCurrentItem] = useState<TableData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [newRow, setNewRow] = useState<TableData | null>(null);
	const [editRow, setEditRow] = useState<TableData | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleAddRow = () => {
		setNewRow({
			companySigDate: new Date().toISOString(),
			companySignatureName: "",
			documentName: "",
			documentStatus: "",
			documentType: "",
			employeeNumber: "",
			employeeSigDate: new Date().toISOString(),
			employeeSignatureName: "",
		});
	};
	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			const response = await axios.get(
				"https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/get",
				{
					headers: { "x-auth": token },
				}
			);
			setData(response.data.data);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
		setIsLoading(false);
	};

	const handleSubmitNewRow = async (e: React.KeyboardEvent | React.MouseEvent) => {
		if ((e as React.KeyboardEvent).key === "Enter" || e.type === "click") {
			if (newRow && Object.values(newRow).every((field) => field !== "")) {
				setIsSubmitting(true);
				try {
					const response = await axios.post(
						"https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/create",
						newRow,
						{
							headers: { "x-auth": token },
						}
					);
					setData([...data, response.data.data]);
					setNewRow(null);
				} catch (error) {
					console.error("Ошибка при добавлении записи", error);
				} finally {
					setIsSubmitting(false);
				}
			} else {
				alert("Пожалуйста, заполните все поля.");
			}
		}
	};

	const handleEditRow = (row: TableData) => {
		setEditRow(row);
	};
	// TODO: не правильно указан токен
	const handleSubmitEditRow = async (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && editRow) {
			if (Object.values(editRow).every((field) => field !== "")) {
				setIsSubmitting(true);
				try {
					const response = await axios.post(`https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/set/${editRow.id}`, editRow, {
						headers: { "x-auth": token },
					});
					setData(data.map((item) => (item.id === editRow.id ? response.data.data : item)));
					setEditRow(null);
				} catch (error) {
					console.error("Ошибка при обновлении записи", error);
				} finally {
					setIsSubmitting(false);
				}
			} else {
				alert("Все поля должны быть заполнены.");
			}
		}
	};

	const handleCreate = async (newItem: Omit<TableData, "id">) => {
		setIsLoading(true);
		try {
			const response = await axios.post(
				"https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/create",
				newItem,
				{
					headers: { "x-auth": token },
				}
			);
			setData([...data, response.data]);
		} catch (error) {
			console.error("Error creating item:", error);
		}
		setIsLoading(false);
	};

	const handleUpdate = async (updatedItem: TableData) => {
		setIsLoading(true);
		try {
			await axios.post(
				`https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/set/${updatedItem.id}`,
				updatedItem,
				{
					headers: { "x-auth": token },
				}
			);
			setData(data.map((item) => (item.id === updatedItem.id ? updatedItem : item)));
		} catch (error) {
			console.error("Error updating item:", error);
		}
		setIsLoading(false);
	};

	const handleDeleteRow = async (id: string) => {
		setIsLoading(true);
		try {
			await axios.post(
				`https://test.v5.pryaniky.com/ru/data/v3/testmethods/docs/userdocs/delete/${id}`,
				{},
				{
					headers: { "x-auth": token },
				}
			);
			setData(data.filter((item) => item.id !== id));
		} catch (error) {
			console.error("Error deleting item:", error);
		}
		setIsLoading(false);
	};

	const handleOpenDialog = (item: TableData | null) => {
		setCurrentItem(item);
		setOpenDeleteDialog(true);
	};

	const handleCloseDialog = () => {
		setOpenDeleteDialog(false);
		setCurrentItem(null);
	};

	const handleSave = (item: TableData) => {
		if (item.id) {
			handleUpdate(item);
		} else {
			handleCreate(item);
		}
		handleCloseDialog();
	};

	const handleChangeNewRow = (field: keyof TableData, value: string) => {
		if (newRow) {
			setNewRow({ ...newRow, [field]: value });
		}
	};

	const handleChangeEditRow = (field: keyof TableData, value: string) => {
		if (editRow) {
			setEditRow({ ...editRow, [field]: value });
		}
	};

	const confirmDelete = async () => {
		if (currentItem) {
			setIsSubmitting(true);
			try {
				await axios.delete(`/api/rows/${currentItem.id}`, {
					headers: { "x-auth": token },
				});
				setData(data.filter((item) => item.id !== currentItem.id));
				setCurrentItem(null);
				setOpenDeleteDialog(false);
			} catch (error) {
				console.error("Ошибка при удалении записи", error);
			} finally {
				setIsSubmitting(false);
			}
		}
	};

	const formatDate = (dateString: string, locale: string = "ru-RU") => {
		const date = new Date(dateString);
		return new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" }).format(
			date
		);
	};

	return (
		<TableContainer
			component={Paper}
			style={{ pointerEvents: isSubmitting ? "none" : "auto" }}
		>
			{isSubmitting && <CircularProgress />}
			<Table>
				<TableHead>
					<TableRow style={{maxHeight: "50px"}}>
						<TableCell style={{width: "250px"}}>Дата компании</TableCell>
						<TableCell>Имя подписанта компании</TableCell>
						<TableCell>Название документа</TableCell>
						<TableCell>Статус документа</TableCell>
						<TableCell>Тип документа</TableCell>
						<TableCell>Номер сотрудника</TableCell>
						<TableCell style={{width: "250px"}}>Дата сотрудника</TableCell>
						<TableCell style={{width: "240px"}}>Имя подписанта сотрудника</TableCell>
						<TableCell style={{width: "200px"}}>Действия</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{isLoading
						? Array(5)
								.fill(0)
								.map((_, index) => (
									<TableRow key={index}>
										<TableCell>
											<Skeleton variant="text" />
										</TableCell>
										<TableCell>
											<Skeleton variant="text" />
										</TableCell>
										<TableCell>
											<Skeleton variant="text" />
										</TableCell>
										<TableCell>
											<Skeleton variant="text" />
										</TableCell>
										<TableCell>
											<Skeleton variant="text" />
										</TableCell>
										<TableCell>
											<Skeleton variant="text" />
										</TableCell>
										<TableCell>
											<Skeleton variant="text" />
										</TableCell>
										<TableCell>
											<Skeleton variant="text" />
										</TableCell>
										<TableCell>
											<Skeleton
												variant="rectangular"
												height={40}
											/>
										</TableCell>
									</TableRow>
								))
						: data.map((row) => (
								<TableRow key={row.id} style={{maxHeight: '50px', width: '100%'}}>
									{editRow?.id === row.id ? (
										<>
											<TableCell style={{width: "250px", padding: "10px"}}>
												<TextField
                          size="small"
													type="datetime-local"
													value={editRow?.companySigDate}
													onChange={(e) =>
														handleChangeEditRow(
															"companySigDate",
															e.target.value
														)
													}
													onKeyDown={handleSubmitEditRow}
												/>
											</TableCell>
											<TableCell style={{width: "240px",padding: "10px"}}>
												<TextField
                        size="small"
													value={editRow?.companySignatureName}
													onChange={(e) =>
														handleChangeEditRow(
															"companySignatureName",
															e.target.value
														)
													}
													onKeyDown={handleSubmitEditRow}
												/>
											</TableCell>
											<TableCell style={{width: "200px",padding: "10px"}}>
												<TextField
                        size="small"
													value={editRow?.documentName}
													onChange={(e) =>
														handleChangeEditRow(
															"documentName",
															e.target.value
														)
													}
													onKeyDown={handleSubmitEditRow}
												/>
											</TableCell>
											<TableCell style={{padding: "10px"}}>
												<TextField
                        size="small"
													value={editRow?.documentStatus}
													onChange={(e) =>
														handleChangeEditRow(
															"documentStatus",
															e.target.value
														)
													}
													onKeyDown={handleSubmitEditRow}
												/>
											</TableCell>
											<TableCell style={{padding: "10px"}}>
												<TextField
                        size="small"
													value={editRow?.documentType}
													onChange={(e) =>
														handleChangeEditRow(
															"documentType",
															e.target.value
														)
													}
													onKeyDown={handleSubmitEditRow}
												/>
											</TableCell>
											<TableCell style={{padding: "10px"}}>
												<TextField
                        size="small"
													value={editRow?.employeeNumber}
													onChange={(e) =>
														handleChangeEditRow(
															"employeeNumber",
															e.target.value
														)
													}
													onKeyDown={handleSubmitEditRow}
												/>
											</TableCell>
											<TableCell style={{padding: "10px"}}>
												<TextField
                        size="small"
													type="datetime-local"
													value={editRow?.employeeSigDate}
													onChange={(e) =>
														handleChangeEditRow(
															"employeeSigDate",
															e.target.value
														)
													}
													onKeyDown={handleSubmitEditRow}
												/>
											</TableCell>
											<TableCell style={{width: "240px",padding: "10px"}}>
												<TextField
                        size="small"
													value={editRow?.employeeSignatureName}
													onChange={(e) =>
														handleChangeEditRow(
															"employeeSignatureName",
															e.target.value
														)
													}
													onKeyDown={handleSubmitEditRow}
												/>
											</TableCell>
											<TableCell style={{padding: "10px"}}>
												<Button onClick={() => setEditRow(null)}>
													Отмена
												</Button>
											</TableCell>
										</>
									) : (
										<>
											<TableCell>{formatDate(row.companySigDate)}</TableCell>
											<TableCell>{row.companySignatureName}</TableCell>
											<TableCell>{row.documentName}</TableCell>
											<TableCell>{row.documentStatus}</TableCell>
											<TableCell>{row.documentType}</TableCell>
											<TableCell>{row.employeeNumber}</TableCell>
											<TableCell>{formatDate(row.employeeSigDate)}</TableCell>
											<TableCell>{row.employeeSignatureName}</TableCell>
											<TableCell>
												<Button onClick={() => handleEditRow(row)}>
													Edit
												</Button>
												<Button
													onClick={() => handleDeleteRow(row.id!)}
													color="error"
												>
													Delete
												</Button>
											</TableCell>
										</>
									)}
								</TableRow>
						  ))}
					{newRow && (
						<TableRow>
							<TableCell style={{padding: '10px'}}>
								<TextField  
                
                  size="small"
									type="datetime-local"
									value={newRow.companySigDate.slice(0, 16)}
									onChange={(e) =>
										handleChangeNewRow("companySigDate", e.target.value)
									}
									onKeyDown={handleSubmitNewRow}
								/>
							</TableCell>
							<TableCell style={{padding: '10px'}}>
								<TextField
                  size="small"
									value={newRow.companySignatureName}
									onChange={(e) =>
										handleChangeNewRow("companySignatureName", e.target.value)
									}
									onKeyDown={handleSubmitNewRow}
								/>
							</TableCell>
							<TableCell style={{padding: '1px'}}>
								<TextField
                  size="small"
									value={newRow.documentName}
									onChange={(e) =>
										handleChangeNewRow("documentName", e.target.value)
									}
									onKeyDown={handleSubmitNewRow}
								/>
							</TableCell>
							<TableCell style={{padding: '10px'}}>
								<TextField
                  size="small"
									value={newRow.documentStatus}
									onChange={(e) =>
										handleChangeNewRow("documentStatus", e.target.value)
									}
									onKeyDown={handleSubmitNewRow}
								/>
							</TableCell>
							<TableCell style={{padding: '10px'}}>
								<TextField
                  size="small"
									value={newRow.documentType}
									onChange={(e) =>
										handleChangeNewRow("documentType", e.target.value)
									}
									onKeyDown={handleSubmitNewRow}
								/>
							</TableCell>
							<TableCell style={{padding: '10px'}}>
								<TextField
                  size="small"
									value={newRow.employeeNumber}
									onChange={(e) =>
										handleChangeNewRow("employeeNumber", e.target.value)
									}
									onKeyDown={handleSubmitNewRow}
								/>
							</TableCell>
							<TableCell style={{padding: '10px'}}>
								<TextField
                  size="small"
									type="datetime-local"
									value={newRow.employeeSigDate.slice(0, 16)}
									onChange={(e) =>
										handleChangeNewRow("employeeSigDate", e.target.value)
									}
									onKeyDown={handleSubmitNewRow}
								/>
							</TableCell>
							<TableCell style={{padding: '10px'}}>
								<TextField
                  size="small"
									value={newRow.employeeSignatureName}
									onChange={(e) =>
										handleChangeNewRow("employeeSignatureName", e.target.value)
									}
									onKeyDown={handleSubmitNewRow}
								/>
							</TableCell>
							<TableCell style={{padding: '10px'}}>
								<Button onClick={handleSubmitNewRow}>Сохранить</Button>
								<Button onClick={() => setNewRow(null)}>Отмена</Button>
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
			<Button
				onClick={handleAddRow}
				disabled={isSubmitting}
				style={{ marginTop: "16px" }}
			>
				Добавить запись
			</Button>

			<Dialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
			>
				<DialogTitle>Подтвердите удаление</DialogTitle>
				<DialogContent>Вы уверены, что хотите удалить эту запись?</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDeleteDialog(false)}>Отмена</Button>
					<Button
						onClick={confirmDelete}
						color="error"
					>
						Удалить
					</Button>
				</DialogActions>
			</Dialog>
		</TableContainer>
	);
};

export default DataTable;
