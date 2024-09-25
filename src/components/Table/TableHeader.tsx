import React from 'react';
import { TableHead, TableRow, TableCell } from "@mui/material";

const headers = ["Document Status", "Employee Number", "Document Type", "Document Name", "Employee Signature", "Company Signature", "Employee Signature Date", "Company Signature Date",  "Actions"];

const TableHeader: React.FC = () => (
  <TableHead>
    <TableRow style={{ maxHeight: "50px" }}>
      {headers.map((header) => (
        <TableCell key={header}>{header}</TableCell>
      ))}
    </TableRow>
  </TableHead>
);

export default TableHeader;