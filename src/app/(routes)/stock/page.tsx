"use client";
import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { getProducts, productSelector } from "@/src/store/slices/productSlice";
import { useAppDispatch } from "@/src/store/store";
import Image from "next/image";
import { productImageURL } from "@/src/utils/commonUtil";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Typography } from "@mui/material";
import { NumericFormat } from "react-number-format";

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "image",
    headerName: "Image",
    width: 80,
    renderCell: ({ value }: GridRenderCellParams<String>) => (
      <Zoom>
        <Image
          key={value}
          height={500}
          width={500}
          alt="product image"
          src={productImageURL(value)}
          style={{
            width: 70,
            height: 70,
            borderRadius: "5%",
            objectFit: "cover",
          }}
        />
      </Zoom>
    ),
  },
  { field: "name", headerName: "Name", width: 350 },
  { 
    field: "price", 
    headerName: "Price", 
    width: 120,
    renderCell: ({value}: GridRenderCellParams<String>) => (
      <Typography variant="body1">
        <NumericFormat 
          value={value}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={2}
          fixedDecimalScale={true}
          prefix={"฿"}
        />
      </Typography>
    ),
  },
  {
    field: "stock",
    headerName: "Stock",
    type: "number",
    width: 150,
    renderCell: ({value}: GridRenderCellParams<String>) => (
      <Typography variant="body1">
        <NumericFormat 
          value={value}
          displayType={"text"}
          thousandSeparator={true}
          decimalScale={0}
          fixedDecimalScale={true}
        />
      </Typography>
    ),
  },
  // {
  //   field: 'fullName',
  //   headerName: 'Full name',
  //   description: 'This column has a value getter and is not sortable.',
  //   sortable: false,
  //   width: 160,
  //   valueGetter: (value, row) => `${row.firstName || ''} ${row.lastName || ''}`,
  // },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function Stock() {
  const reducer = useSelector(productSelector);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={reducer.products}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
