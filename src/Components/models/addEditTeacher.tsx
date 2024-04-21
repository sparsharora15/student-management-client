import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { DatePicker } from "../ComonComponents/datePicker";
import SelectDropdown from "../ComonComponents/selectDropdown";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";

import { crateTeacher, getCourses, updateTeacher } from "../../HttpServices";
import { isNotFutureDate } from "../../Utils/helper";
import { CourseData } from "../../Utils/interface";
import {
  isValidEmail,
  validatePhoneNumber,
  validateUserName,
} from "../../Utils/regex";
import Dropzone from "../ComonComponents/Dropzone";
import Loader from "../loader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { toast } from "../ui/use-toast";

interface AddEditTeacherProps {
  open: boolean;
  onOpenChange: () => void;
  getAllTechersData: () => void;
  teacherData: Teacher;
  teacherId: string;
}
interface dropDownValues {
  value: string;
  label: string;
}
interface TeachingDepartment {
  _id: string;
  fullName: string;
}
interface Teacher {
  employeeID: string;
  fullName: string;
  dob: Date | string;
  email: string;
  teachingDepartment: any[];
  address: string;
  gender: string;
  phoneNo: string;
  profilePicturePublicId: string;
  isActive: boolean;
}
const validationSchema = z.object({
  dob: z
    .union([
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
  setActive: z.object({
    label: z.string(),
    value: z.string(),
  }),
  teachingDepartment: z
    .array(
      z.object({
        label: z.string(),
        value: z.string(),
      })
    )
    .refine((departments) => departments.length >= 1, {
      message: "At least one teaching department must be selected.",
    }),

  address: z.string().min(1, { message: "Address is required." }),
  fullName: z
    .string()
    .min(1, { message: "Name is required" })
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
  phoneNo: z
    .string()
    .min(1, { message: "Phone number is required" })
    .refine((value: string | null) => {
      return !value || (value.length >= 10 && validatePhoneNumber(value));
    }),
});

const AddEditTeacher = ({
  open,
  onOpenChange,
  getAllTechersData,
  teacherId,
  teacherData,
}: AddEditTeacherProps) => {
  const token = localStorage.getItem("adminToken");
  const [userPicture, setUserPicture] = useState<File | string>();
  const [imageChange, setImageChange] = useState<boolean>(false);
  const [validateImage, setValidateImage] = useState<boolean>(false);
  const {
    formState: { isSubmitting, isDirty, isValid }, // here
  } = useForm({ mode: "onChange" });

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

  const [selectedValue, setSelectedValue] = useState(dropDownValues[0]);
  const [selectedGenderValue, setSelectedGenderValue] = useState<
    dropDownValues | undefined | null
  >();
  const [courseData, setCourseData] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [popupType, setPopupType] = useState<"edit" | "add">("add");

  const [departmentOptions, setDepartmentOptions] = useState<
    dropDownValues[] | null
  >(null);
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
      setActive: selectedValue,
      gender: undefined,
      teachingDepartment: [],
      address: "",
      fullName: "",
      phoneNo: "",
      email: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    try {
      if (validateImage) return;

      setLoading(true);

      const { setActive, teachingDepartment, gender, ...rest } = values;
      const isActive = setActive.label === "yes";
      const newTeachingDepartment = teachingDepartment.map(
        (data) => data.value
      );

      const formData = new FormData();
      formData.append("profilePicture", userPicture as File);

      const payload = {
        ...rest,
        isActive,
        gender: gender.value,
        teachingDepartment: newTeachingDepartment,
      };

      const res = await (popupType === "add"
        ? crateTeacher(token as string, formData, payload)
        : updateTeacher(
            token as string,
            formData,
            payload,
            teacherId as string
          ));

      if (res.data.status === 200) {
        toast({
          variant: "success",
          title: res.data.message,
        });
        getAllTechersData();
      }
    } catch (err: any) {
      console.warn(err);
      toast({
        variant: "destructive",
        title: err?.response?.data?.message,
      });
    } finally {
      setLoading(false);
      onOpenChange();
    }
  };

  useEffect(() => {
    form.setValue("setActive", selectedValue);
  }, [selectedValue]);
  useEffect(() => {
    form.setValue("dob", dob as Date);
  }, [dob]);

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
    if (teacherData) {
      setPopupType("edit");
      const { address, email, fullName, phoneNo, gender } = teacherData;
      form.setValue("address", address);
      setDob(teacherData.dob as Date);
      form.setValue("dob", teacherData.dob as Date);
      form.setValue("email", email);
      form.setValue("fullName", fullName);
      form.setValue("phoneNo", phoneNo);
      const newTeachingDepartment = teacherData?.teachingDepartment.map(
        (department: any) => ({
          value: department._id,
          label: department.fullName,
        })
      );
      if (gender === "Male") {
        form.setValue("gender", genderOptions[0]);
        setSelectedGenderValue(genderOptions[0] as dropDownValues);
      } else {
        form.setValue("gender", genderOptions[1]);
        setSelectedGenderValue(genderOptions[1] as dropDownValues);
      }
      if (teacherData?.profilePicturePublicId) {
        setUserPicture(teacherData?.profilePicturePublicId as string);
      }
      setDepartmentOptions(newTeachingDepartment);
      form.setValue("teachingDepartment", newTeachingDepartment);
      if (teacherData.isActive) {
        form.setValue("setActive", dropDownValues[0]);
        setSelectedValue(dropDownValues[0]);
      } else {
        form.setValue("setActive", dropDownValues[1]);
        setSelectedValue(dropDownValues[1]);
      }
    }
  }, [teacherData]);
  useEffect(() => {
    if (departmentOptions) {
      form.setValue("teachingDepartment", departmentOptions);
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
                    name="teachingDepartment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="teachingDepartment">
                          Teaching Department
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <SelectDropdown
                            isMulti={true}
                            options={courseData?.map((course) => ({
                              value: course?._id,
                              label: course?.name,
                            }))}
                            onChange={(selectedOption: any) =>
                              setDepartmentOptions(selectedOption)
                            }
                            // @ts-ignore
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
                    name="setActive"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="setActive">
                          Set Active<span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <SelectDropdown
                            options={dropDownValues}
                            onChange={(selectedOption: any) => {
                              setSelectedValue(selectedOption);
                            }}
                            // @ts-ignore
                            value={selectedValue || null}
                            placeholder="Select an option"
                          />
                        </FormControl>
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
                  <Button
                    disabled={loading}
                    type="submit"
                    onClick={() => validateUserImage()}
                  >
                    {loading ? <Loader /> : "Save"}
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

export default AddEditTeacher;
