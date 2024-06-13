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
    accessorKey: 'date',
    header: 'DATE:HEURE'
  },
  {
    accessorKey: 'titre',
    header: 'TITRE'
  },
  {
    accessorKey: 'service',
    header: 'SERVICE'
  },
  {
    accessorKey: 'status',
    header: 'STATUS'
  },
  {
    id: 'actions',
    cell: ({ row }) => <CellAction data={row.original} />
  }
];
