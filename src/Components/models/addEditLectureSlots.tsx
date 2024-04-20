import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import SelectDropdown from "../ComonComponents/selectDropdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { validatePhoneNumber, validateUserName } from "../../Utils/regex";
import { Input } from "../ui/input";
import { createLecture } from "../../HttpServices";
import Loader from "../loader";
import { toast } from "../ui/use-toast";

interface AddEditLectureSlot {
  open: boolean;
  onOpenChange: () => void;
}

const validationSchema = z.object({
  collegeStartTime: z
    .string()
    .min(1, { message: "College start hours is required" }),
  collegeEndTime: z
    .string()
    .min(1, { message: "College end hours is required" }),
  lectureTime: z.string().min(1, { message: "College end hours is required" }),

  recessTimeFrom: z
    .string()
    .min(1, { message: "Recess time from is required " }),
  recessTimeTo: z.string().min(1, { message: "Recess time to is required " }),
});

const AddEditLectureSlots = ({ open, onOpenChange }: AddEditLectureSlot) => {
  const token = localStorage.getItem("adminToken");
  const [loading, setLoading] = useState<boolean>(false);
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      collegeStartTime: "",
      collegeEndTime: "",
      lectureTime: "",
      recessTimeFrom: "",
      recessTimeTo: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    try {
      setLoading(true);
      const response = await createLecture(token as string, values);
      console.log(response.status === 201);
      if (response.status === 201) {
        toast({
          variant: "success",
          title: response?.data.message,
        });
        onOpenChange()
      }
    } catch (err:any) {
      toast({
        variant: "destructive",
        // @ts-ignore
        title: err?.response?.data.message ,
      });
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const validateRecessTimeWithinCollegeHours = (
    recessTimeFrom: string,
    recessTimeTo: string,
    collegeStartTime: string,
    collegeEndTime: string
  ) => {
    const collegeStart = new Date(`2022-01-01T${collegeStartTime}`);
    const collegeEnd = new Date(`2022-01-01T${collegeEndTime}`);
    const recessStart = new Date(`2022-01-01T${recessTimeFrom}`);
    const recessEnd = new Date(`2022-01-01T${recessTimeTo}`);

    return recessStart >= collegeStart && recessEnd <= collegeEnd;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white p-[20px] max-h-[90vh]  overflow-y-scroll">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" w-full focus:outline-none "
          >
            <div className="w-full  flex flex-col">
              <p className="text-[#1E293B] font-semibold text-[24px]">
                Add Time Slot Details
              </p>

              <div className="grid grid-cols-3 gap-5">
                <FormField
                  control={form.control}
                  name="collegeStartTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="collegeStartTime">
                        College Start Time
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          aria-label="Choose time"
                          className="w-full flex justify-between"
                          id="collegeStartTime"
                          type="time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="collegeEndTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="collegeEndTime">
                        College End Time
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          aria-label="Choose time"
                          className="w-full flex justify-between"
                          id="collegeEndTime"
                          type="time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lectureTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="lectureTime">
                        Lecture Time (in minutes)
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full"
                          id="lectureTime"
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="recessTimeFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="recessTimeFrom">
                        Recess Time From
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          aria-label="Choose time"
                          className="w-full flex justify-between"
                          id="recessTimeFrom"
                          type="time"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="recessTimeTo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="recessTimeTo">
                        Recess Time To
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          aria-label="Choose time"
                          className="w-full flex justify-between"
                          id="recessTimeTo"
                          type="time"
                          {...field}
                          onChange={(e) => {
                            const recessTimeFrom =
                              form.getValues("recessTimeFrom");
                            const recessTimeTo = e.target.value;
                            const collegeStartTime =
                              form.getValues("collegeStartTime");
                            const collegeEndTime =
                              form.getValues("collegeEndTime");
                            if (
                              validateRecessTimeWithinCollegeHours(
                                recessTimeFrom,
                                recessTimeTo,
                                collegeStartTime,
                                collegeEndTime
                              )
                            ) {
                              // Update the field value if it's within college hours
                              field.onChange(e);
                            } else {
                              // Clear the value if it's not within college hours
                              field.onChange("");
                              toast({
                                variant: "destructive",
                                title: "Recess time should be within college hours",
                              });
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="w-full flex flex-row items-center justify-start mt-2 gap-2">
              <DialogFooter className="flex gap-2 flex-row">
                <Button type="submit">{loading ? <Loader /> : "Save"}</Button>
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
  );
};

export default AddEditLectureSlots;
