import { GetSession, SignIn, SignUp } from "../models/auth.model";
import httpClient from "../utils/httpClient";

type signProps = {
  username: string;
  password: string;
};

export const signUp = async (user: signProps): Promise<SignUp> => {
  const response = await httpClient.post<any>("/authen/register", user);
  return response.data;
};

export const signIn = async (user: signProps): Promise<SignIn> => {
  const response = await httpClient.post<any>("/auth/signin", user, {
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
  });
  return response.data;
};

export async function signOut() {
  const response = await httpClient.get(`/auth/signout`,{
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
  });
  return response.data;
}

export const getSession = async () :Promise<GetSession>=>{
  const response = await httpClient.get(`/auth/session`,{
    baseURL: process.env.NEXT_PUBLIC_BASE_URL_LOCAL_API,
  });

  return response.data;
}

export const getProduct = async (keyword?: string) => {
  if(keyword){
    return (await httpClient.get(`/stock/product/keyword/${keyword}`)).data;
  }else{
    return (await httpClient.get(`/stock/product`)).data;
  }
};

export const addProduct = async (data: FormData): Promise<void> => {
  await httpClient.post(`/stock/product`, data);
};

export const doGetStockById = async (id: string) => {
  const response = await httpClient.get(`/stock/product/${id}`);
  return response.data;
};

export const editProduct = async (data: FormData): Promise<void> => {
  await httpClient.put(`/stock/product`, data);
};

export const deleteProduct = async (id: string): Promise<void> => {
  await httpClient.delete(`/stock/product/${id}`);
};