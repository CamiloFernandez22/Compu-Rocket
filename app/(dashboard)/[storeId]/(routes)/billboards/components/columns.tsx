//Esta estructura fue tomoda de un componente de Shadcn 
//Este sera un componente del lado del client 
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type BillboardColumn = {
  id: string
  label: string
  createdAt: string;
}

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: "label",
    header: "Label",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    //Aqui estamos llamando al objeto original row de Tanstack
    cell: ({row}) => <CellAction data={row.original}/>
  }
]
