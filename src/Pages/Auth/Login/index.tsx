import React, { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import loginImg from "../../../images/login-sidder-image.png";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../Components/ui/form";
import { isValidEmail } from "../../../Utils/regex";
import { Input } from "../../../Components/ui/input";
import { Button } from "../../../Components/ui/button";
import Loader from "../../../Components/loader";
import { login } from "../../../HttpServices";
const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: "Email is required.",
    })
    .refine((data) => isValidEmail(data), {
      message: "Invalid email address.",
    }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof loginFormSchema>) => {
    try {
      setLoading(true);

      const response = await login(values);
      if (response?.data?.status === 200) {
        localStorage.setItem("adminToken", response.data.token);
        navigate("/");
      }
    } catch (err: any) {
      // showToast(err?.response?.data?.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="loginBG flex items-center justify-center w-full h-[100vh]">
      <div className="grid grid-cols-1 md:grid-cols-2 bg-[#FFFFFF] w-3/4 md:w-auto p-7 border rounded-sm">
        <div>
          <img className="" alt="" src={loginImg} />
        </div>
        <div className="p-0 md:p-[15px]">
          <div className="flex flex-col gap-5 items-center md:items-start">
            <h2 className="text-[#000000] font-semibold text-[25px]">
              Welcome Back!
            </h2>
            <p className="text-[#000000] font-normal  text-[16px]">
              Please login to continue
            </p>
            <Form {...form}>
              <form
                className="w-full flex flex-col gap-5"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="emailAddress">
                        Email Address <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="text" id="emailAddress" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="password">
                        Password <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input type="password" id="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full bg-[#0F172A]">
                  {!loading ? "Login" : <Loader />}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
