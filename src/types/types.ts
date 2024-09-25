export interface TableData {
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

export interface DataTableProps {
  token: string;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EditableTableData extends TableData {
  isEditing: boolean;
}

export type TableDataKeys = keyof Omit<TableData, "id">;