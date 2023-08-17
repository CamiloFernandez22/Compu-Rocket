//Esta estructura fue tomoda de un componente de Shadcn 
//Este sera un componente del lado del client 
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type SizeColumn = {
  id: string
  name: string
  value: string
  createdAt: string;
}

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "value",
    header: "Value",
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
