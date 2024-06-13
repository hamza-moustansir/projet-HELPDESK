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
    header: 'TITLE'
  },
  {
    accessorKey: 'job',
    header: 'NAME AUTHOR'
  },
  {
    accessorKey: 'email',
    header: 'EMAIL AUTHOR'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
