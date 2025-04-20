"use client";
import * as React from "react";
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbarContainer, GridToolbarFilterButton } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import { useSelector } from "react-redux";
import { deleteProduct, getProducts, productSelector } from "@/src/store/slices/productSlice";
import { useAppDispatch } from "@/src/store/store";
import Image from "next/image";
import { productImageURL } from "@/src/utils/commonUtil";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab, IconButton, Stack, Typography } from "@mui/material";
import { NumericFormat } from "react-number-format";
import dayjs from "dayjs";
import { Add, Delete, Edit } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userSelector } from "@/src/store/slices/userSlice";
import { ProductData } from "@/src/models/product.model";
import { useState } from "react";

export default function Stock() {
  const reducer = useSelector(productSelector);
  const userReducer = useSelector(userSelector);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [openDialog,setOpenDialog] = useState(false);
  const [selectedProduct,setSelectedProduct] = useState<ProductData | null>(null);

  React.useEffect(() => {
    if(!userReducer.isAuthenticating){
      dispatch(getProducts());
    }
  }, [dispatch,userReducer.isAuthenticating]);

  const handleClose = () =>{
    setOpenDialog(false);
  }

  const handleDeleteConfirm = async () => {
    if(selectedProduct){
      const result = await dispatch(deleteProduct(String(selectedProduct.id)));
      if(result.meta.requestStatus == "fulfilled"){
        dispatch(getProducts());
        setOpenDialog(false);
      }else{
        alert("Failed to delete");
      }
    }
  };

  const showDialog = () => {
    if(selectedProduct === null){
      return;
    }

    return (
        <Dialog
          open={openDialog}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            <Image
              width={100}
              height={100}
              src={productImageURL(selectedProduct.image)} 
              alt={"product image"}
              style={{width: 100 , borderRadius: "5%", objectFit: "cover"}}              
            />
            <br />
            Confirm to delete the product? : {selectedProduct.name}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You cannot restore deleted product.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="info">
              Cancel
            </Button>
            <Button onClick={handleDeleteConfirm} color="primary">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
    );
  };

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
      width: 130,
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
    {
      field: "createdAt", 
      headerName: "Timestamp", 
      width: 230,
      renderCell: ({value} : GridRenderCellParams<String>) => (
        <Typography variant="body1">
          {dayjs(value).format("DD/MM/YYYY HH:mm")}
        </Typography>
      ),
    },
    {
      field: ".",
      headerName: "Action",
      width: 120,
      renderCell: ({row}: GridRenderCellParams<any>) =>(
        <Stack direction={"row"}>
          <IconButton
            aria-label="edit"
            size="large"
            onClick={() => router.push(`/stock/edit?id=${row.id}`)}
          >
            <Edit fontSize="inherit"/>
          </IconButton>
          <IconButton
            aria-label="delete"
            size="large"
            onClick={()=>{
              setSelectedProduct(row);
              setOpenDialog(true);
            }}
          >
            <Delete fontSize="inherit" />
          </IconButton>
        </Stack>
      ), 
    }
  ];
  
  const paginationModel = { page: 0, pageSize: 5 };

  const CustomToolbar: React.FunctionComponent<{
    setFilterButtonEl: React.Dispatch<
      React.SetStateAction<HTMLButtonElement | null>
    >;
  }> = ({ setFilterButtonEl }) => (
    <GridToolbarContainer>
      <GridToolbarFilterButton ref={setFilterButtonEl} />
      <Link href="/stock/add">
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "absolute",
            top:10,
            right:10
          }}
        >
          <Add />
        </Fab>
      </Link>
    </GridToolbarContainer>
  );

  return (
    <Paper sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={reducer.products}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        slots={{
          //@ts-ignore
          toolbar: CustomToolbar
        }}
        sx={{ border: 0 }}
      />
      {showDialog()}
    </Paper>
  );
}