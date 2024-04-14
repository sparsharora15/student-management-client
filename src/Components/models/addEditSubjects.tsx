import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { addSubject } from "../../HttpServices";
import { useState } from "react";
import Loader from "../loader";
interface AddEditSubject {
  open: boolean;
  onOpenChange: () => void;
}

const validationSchema = z.object({
  fullName: z.string().min(1, { message: "Name is required" }),
});

const AddEditSubjects = ({ open, onOpenChange }: AddEditSubject) => {
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      fullName: "",
    },
  });
  const token = localStorage.getItem("adminToken");

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    try {
      setLoading(true);

      const response = await addSubject(token as string, values);

      if (response.data.status === 200) {
        toast.success(response.data.message);
        onOpenChange();
      }
    } catch (err:unknown | any) {
      toast.error(err?.response?.data?.message as string);

      console.warn(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white p-[20px] max-h-[90vh]  overflow-y-scroll">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" w-full focus:outline-none "
            >
              <div className="w-full  flex flex-col">
                <p className="text-[#1E293B] font-semibold text-[24px]">
                  Add Subject Details
                </p>

                <div className="">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="Name">
                          Name<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Input type="text" id="Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="w-full flex flex-row items-center justify-start mt-2 gap-2">
                <DialogFooter className="flex gap-2 flex-row">
                  <Button type="submit">
                    {!loading ? "Save" : <Loader />}
                  </Button>
                  <Button
                    className="bg-[#FFFFFF] text-[#1E293B] border hover:bg-[#FFFFFF] hover:text-[#1E293B]"
                    onClick={onOpenChange}
                  >
                    Cancel
                  </Button>
                </DialogFooter>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddEditSubjects;
