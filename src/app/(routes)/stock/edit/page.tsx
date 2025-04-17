import { ProductData } from "@/src/models/product.model";
import { doGetStockById } from "@/src/services/serverService";
import * as Yup from "yup";
import StockEditForm from "./StockEditForm";

const formValidateSchema = Yup.object().shape({
  name: Yup.string().required("Name is required").trim(),
  price: Yup.number().min(100, "Number must be greater than 100"),
  stock: Yup.number().min(100, "Number must be greater than 100"),
});

type Props = {
  searchParams: {
    id?: string;
  };
};

export default async function StockEdit({ searchParams }: Props) {
  let product = {} as ProductData;
  if (searchParams.id) {
    product = await doGetStockById(searchParams.id);
    console.log("ssr fetch edit" + JSON.stringify(product));
  }

  return (
    <div>
      <StockEditForm product={product}></StockEditForm>
    </div>
  );
}