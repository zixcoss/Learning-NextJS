"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import * as Icons from "@mui/icons-material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "@/src/store/store";
import { signUp, userSelector } from "@/src/store/slices/userSlice";
import { useSelector } from "react-redux";

interface User {
  username: string;
  password: string;
}

type Props = {};

export default function Register({}: Props) {
  const router = useRouter();
  const initialValue: User = { username: "", password: "" };
  const formValidateSchema = Yup.object().shape({
    username: Yup.string().required("Username is required").trim(),
    password: Yup.string().required("Password is required").trim()
  });

  const { control, handleSubmit ,formState: {errors}} = useForm<User>({
    defaultValues: initialValue,
    resolver: yupResolver(formValidateSchema),
  });

  const reducer = useSelector(userSelector);
  const dispatch = useAppDispatch();

  const showForm = () => {
    return (
      <form onSubmit={handleSubmit(async (value:User)=> {
        const result = await dispatch(signUp(value));
        if(signUp.fulfilled.match(result)){
          alert("Register successfully");
        }else if(signUp.rejected.match(result)){
          alert("Register failed");
        }
      })}>
        {/* Username */}
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              variant="outlined"
              margin="normal"
              error={(errors.username?.message ?? "") != ""}
              helperText={errors.username?.message?.toString()}
              fullWidth
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icons.Email />
                    </InputAdornment>
                  ),
                },
              }}
              label="Username"
              autoComplete="email"
              autoFocus
            />
          )}
        />

        {/* Password */}
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              error={(errors.password?.message ?? "") != ""}
              helperText={errors.password?.message?.toString()}
              variant="outlined"
              margin="normal"
              fullWidth
              type="password"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Icons.Password />
                    </InputAdornment>
                  ),
                },
              }}
              label="Password"
              autoComplete="password"
              autoFocus
            />
          )}
        />

        <Button
          sx={{ marginTop: 4 }}
          // className="mt-8"
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Create
        </Button>

        <Button
          sx={{ marginTop: 2 }}
          // className="mt-4"
          type="button"
          fullWidth
          variant="outlined"
          onClick={() => {
            router.push("/login");
          }}
        >
          Cancel
        </Button>
      </form>
    );
  };

  return (
    <Box className="flex justify-center items-center">
      <Card className="max-w-[345px] mt-[100px]">
      <CardMedia 
          sx={{height: 200}}
          image="/static/image/next_register.jpg"
          title="Contemplative Reptile"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2" className="flex justify-center">
            Register
          </Typography>
          {showForm()}
        </CardContent>
      </Card>
      <style jsx global>
        {`
          body {
            min-height: 100vh;
            position: relative;
            margin: 0;
            background-size: cover;
            background-image: url("/static/image/bg.jpg");
          }
        `}
      </style>
    </Box>
  );
}
