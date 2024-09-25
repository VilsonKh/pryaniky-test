import React from 'react';
import { TableRow, TableCell } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

interface SkeletonCellsProps {
  count: number;
  variant?: 'text' | 'rectangular' | 'circular';
  height?: number;
}

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const SkeletonCells: React.FC<SkeletonCellsProps> = ({ count, variant = 'text', height = 40 }) => {
  return (
    <>
      {Array(count)
        .fill(0)
        .map((_, idx) => (
          <TableCell key={idx}>
            <Skeleton variant={variant} height={variant === 'rectangular' ? height : undefined} />
          </TableCell>
        ))}
    </>
  );
};

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 9 }) => {
  return (
    <>
      {Array(rows)
        .fill(0)
        .map((_, rowIndex) => (
          <TableRow key={rowIndex}>
            <SkeletonCells count={columns - 1} />
            <SkeletonCells count={1} variant="rectangular" height={40} />
          </TableRow>
        ))}
    </>
  );
};

export default TableSkeleton;
