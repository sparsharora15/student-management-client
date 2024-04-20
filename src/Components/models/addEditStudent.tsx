import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import Loader from "../loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import {
  isValidEmail,
  validatePhoneNumber,
  validateUserName,
} from "../../Utils/regex";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { crateStudent } from "../../HttpServices";
import Dropzone from "../ComonComponents/Dropzone";
import { CourseData, dropDownValues } from "../../Utils/interface";
import { Input } from "../ui/input";
import { DatePicker } from "../ComonComponents/datePicker";
import SelectDropdown from "../ComonComponents/selectDropdown";
import { toast } from "../ui/use-toast";
import { getCourses } from "../../HttpServices";

interface AddEditStudentProps {
  open: boolean;
  onOpenChange: () => void;
  getAllStudentsData: () => void;
}
const validationSchema = z.object({
  dob: z.union([
    z.date(),
    z.string().refine((value) => {
      const date = new Date(value);
      return !isNaN(date.getTime());
    }),
  ]),

  gender: z.object({
    label: z.string(),
    value: z.string(),
  }),
  course: z.object({
    label: z.string(),
    value: z.string(),
  }),
  address: z.string().min(1, { message: "Address is required." }),
  fullName: z
    .string()
    .min(1, { message: "Name is required" })
    .max(255, { message: "User Name must be at most 255 characters" })
    .refine((value) => validateUserName(value), {
      message: "Special characters are not allowed in the user name.",
    }),
  bloodGroup: z
    .string()
    .min(1, { message: "Blood group is required" })
    .max(255, { message: "User Name must be at most 255 characters" })
    .refine((value) => validateUserName(value), {
      message: "Special characters are not allowed in the user name.",
    }),
  email: z
    .string()
    .min(1, { message: "User Email is required." })
    .refine((data) => isValidEmail(data), {
      message: "Invalid email address.",
    }),
  fName: z.string().min(1, { message: "Father name is required." }),

  phoneNo: z
    .string()
    .min(1, { message: "Phone number is required" })
    .refine((value: string | null) => {
      return !value || (value.length >= 10 && validatePhoneNumber(value));
    }),
});
const AddEditStudent = ({ onOpenChange, open ,getAllStudentsData}: AddEditStudentProps) => {
  const dropDownValues: dropDownValues[] = [
    {
      value: "Yes",
      label: "yes",
    },
    {
      value: "No",
      label: "no",
    },
  ];
  const genderOptions: dropDownValues[] = [
    {
      value: "Male",
      label: "Male",
    },
    {
      value: "Female",
      label: "Female",
    },
  ];

  const [dob, setDob] = useState<Date | null>(null);
  const token = localStorage.getItem("adminToken");
  const [userPicture, setUserPicture] = useState<File | string>();
  const [imageChange, setImageChange] = useState<boolean>(false);
  const [validateImage, setValidateImage] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState(dropDownValues[0]);
  const [selectedGenderValue, setSelectedGenderValue] = useState<
    dropDownValues | undefined | null
  >();
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<"edit" | "add">("add");

  const [departmentOptions, setDepartmentOptions] =
    useState<dropDownValues | null>(null);
  const validateUserImage = () => {
    if (!userPicture) {
      return setValidateImage(true);
    }
    return setValidateImage(false);
  };
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      dob: dob as Date,
      gender: undefined,
      course: undefined,
      address: "",
      fullName: "",
      fName: "",
      phoneNo: "",
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    try {
      const {  course, gender, ...rest } = values;
         const newCourse = course.value

      const formData = new FormData();
      formData.append("profilePicture", userPicture as File);

      const payload = {
        ...rest,
        gender: gender.value,
        course: newCourse,
      };

      const res = await (popupType === "add"
        ? crateStudent(token as string, formData, payload)
        :crateStudent(token as string, formData, payload) );

      if (res.data.status === 200) {
        toast({
          variant: "success",
          title: res.data.message,
        });
        getAllStudentsData();
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const getCoursesList = async () => {
    try {
      setLoading(true);
      const coursesData = await getCourses(token as string);
      if (coursesData.data.status === 200) {
        setCourseData(coursesData.data.documents);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getCoursesList();
  }, []);
  useEffect(() => {
    form.setValue("dob", dob as Date);
  }, [dob]);
  useEffect(() => {
    if (departmentOptions) {
      form.setValue("course", departmentOptions);
    }
  }, [departmentOptions]);
  useEffect(() => {
    if (selectedGenderValue) {
      form.setValue("gender", selectedGenderValue);
    }
  }, [selectedGenderValue]);
  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white p-[20px] max-h-[90vh] ">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className=" w-full focus:outline-none "
            >
              <div className="w-full  flex flex-col">
                <p className="text-[#1E293B] font-semibold text-[24px]">
                  {popupType === "edit"
                    ? "Update Teacher Details"
                    : "Add Teacher Details"}
                </p>

                <div className="grid grid-cols-3 gap-5">
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
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="Email">
                          Email<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Input type="email" id="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="fatherName">
                          Father's Name<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Input type="text" id="fatherName" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bloodGroup"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="bloodGroup">
                          Blood group<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Input type="text" id="bloodGroup" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phoneNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="phone">
                          Phone no.<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Input type="phone" id="phone" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="dob">
                          DOB<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <DatePicker date={dob} onSelect={setDob} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="Address">
                          Address<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          {/* @ts-ignore */}
                          <Input type="text" id="Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="course"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="course">
                          Course
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <SelectDropdown
                            isMulti={false}
                            options={courseData?.map((course) => ({
                              value: course?._id,
                              label: course?.name,
                            }))}
                            onChange={(selectedOption: any) =>
                              setDepartmentOptions(selectedOption)
                            }
                            value={departmentOptions}
                            placeholder="Select an option"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="gender">
                          Gender<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <SelectDropdown
                            options={genderOptions}
                            onChange={(selectedOption: any) => {
                              setSelectedGenderValue(selectedOption);
                            }}
                            // @ts-ignore
                            value={selectedGenderValue}
                            placeholder="Select an option"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col gap-1 ">
                    <FormLabel htmlFor="setActive">
                      User Image<span className="text-red-500">*</span>
                    </FormLabel>
                    <Dropzone
                      disabled={false}
                      maxFiles={1}
                      getFiles={(files) => setUserPicture(files[0])}
                      file={userPicture as File}
                      accept={{ "image/*": [".png", ".jpg", ".jpeg"] }}
                      setImageChange={() => setImageChange(true)}
                      setImagePrev={setUserPicture}
                    />
                    {validateImage && (
                      <p className="text-sm font-medium text-destructive">
                        Please upload user image
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className=" grid grid-cols-2 gap-4"></div>
              <div className="w-full flex flex-row items-center justify-start mt-2 gap-2">
                <DialogFooter className="flex gap-2 flex-row">
                  <Button disabled={false} type="submit" onClick={() => {}}>
                    {false ? <Loader /> : "Save"}
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

export default AddEditStudent;
