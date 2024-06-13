import { Checkbox } from '@/components/ui/checkbox';
import { Employee } from '@/constants/data';
import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from './cell-action';

export const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'date',
    header: ''
  },
  {
    accessorKey: 'first_name',
    header: 'EMAIL'
  },
  {
    accessorKey: 'first_name',
    header: 'SERVICE'
  },
  {
    accessorKey: 'email',
    header: 'AVIS'
  },
  
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
