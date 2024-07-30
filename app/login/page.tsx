"use client";

import { LogInForm } from "@/typings/model";
import { EMAIL_REGEX } from "@/utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import SignInIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Paper,
  Typography,
} from "@mui/material";
import { SignInResponse, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import * as yup from "yup";
import Loading from "../components/Loading";
import { openToast } from "../components/Toast";

const logInFormSchema = yup.object<LogInForm>().shape({
  email: yup.string().required().matches(EMAIL_REGEX, "Invalid Email Format."),
  password: yup.string().required().min(6, "Password length must be more than 6."),
});

const initialLogInForm: LogInForm = {
  email: "",
  password: "",
};

export default function LogIn() {
  const formMethods = useForm<LogInForm>({
    reValidateMode: "onSubmit",
    defaultValues: initialLogInForm,
    resolver: yupResolver(logInFormSchema),
  });

  const { handleSubmit, control } = formMethods;

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const processSignIn = async (loginData: LogInForm) => {
    try {
      setIsLoading(true);
      const { email, password } = loginData;
      const response: SignInResponse | undefined = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!response?.ok) throw response;
      router.replace("/user-management");
      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      if (error?.status === 401) {
        openToast("Log In Failed with Invalid Email or Password.");
      } else {
        openToast(JSON.stringify(error?.error || error?.message || error));
      }
    }
  };

  return (
    <>
      {isLoading && <Loading />}
      <Grid data-testid="login-page-container" container alignItems="center" justifyContent="center" height="100%">
        <Grid item xs={8}>
          <Paper elevation={8}>
            <FormProvider {...formMethods}>
              <form onSubmit={handleSubmit(processSignIn)}>
                <Box data-testid="login-page-title" padding="24px" width="100%">
                  <Typography variant="h5" marginBottom="24px">
                    Log In
                  </Typography>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl margin="dense" fullWidth variant="outlined">
                        <InputLabel data-testid="login-email-label" htmlFor="outlined-adornment-email">
                          Email
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-email"
                          label="Email"
                          inputProps={{
                            ...field,
                            "data-testid": "login-email-input",
                          }}
                          error={!!error}
                        />
                        <FormHelperText data-testid="login-email-error" error={Boolean(error?.message)}>
                          {error?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field, fieldState: { error } }) => (
                      <FormControl margin="dense" fullWidth variant="outlined">
                        <InputLabel data-testid="login-password-label" htmlFor="outlined-adornment-password">
                          Password
                        </InputLabel>
                        <OutlinedInput
                          id="outlined-adornment-password"
                          type={showPassword ? "text" : "password"}
                          endAdornment={
                            <InputAdornment position="end">
                              <IconButton
                                data-testid="password-visibility-icon"
                                onClick={handleClickShowPassword}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          }
                          label="Password"
                          inputProps={{
                            ...field,
                            "data-testid": "login-password-input",
                          }}
                          error={!!error}
                        />
                        <FormHelperText data-testid="login-password-error" error={Boolean(error?.message)}>
                          {error?.message}
                        </FormHelperText>
                      </FormControl>
                    )}
                  />
                  <Button
                    data-testid="login-submit-button"
                    size="large"
                    fullWidth
                    variant="contained"
                    startIcon={<SignInIcon />}
                    sx={{ marginTop: "24px" }}
                    type="submit"
                  >
                    Log In
                  </Button>
                </Box>
              </form>
            </FormProvider>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
