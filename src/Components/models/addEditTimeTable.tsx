import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { useEffect, useState } from "react";
import SelectDropdown from "../ComonComponents/selectDropdown";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

//course data imports



import { getCourses } from "../../HttpServices";
import { CourseData } from "../../Utils/interface";
//

import * as z from "zod";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { validateUserName } from "../../Utils/regex";
import { Input } from "../ui/input";
import { dropDownValues } from "../../Utils/interface";
import axios from "axios";
import { BASE_URL } from "../../Utils/constants";

// 
interface Option {
  value: string;
  label: string;
}
// 


interface AddEditTimeTableProps {
  open: boolean;
  onOpenChange: () => void;
}
interface Teacher {
  value: string;
  label: string;
}
interface Lecture {
  id: number;
  name: string;
  time: string;
}
const validationSchema = z.object({
  course: z.object({
    label: z.string(),
    value: z.string(),
  }),
  sem: z.object({
    label: z.string(),
    value: z.string(),
  }),
  subject: z.object({
    label: z.string(),
    value: z.string(),
  }),
  teacher: z.object({
    label: z.string(),
    value: z.string(),
  }),
  venue: z.string().min(1, { message: "Venue is required" }),
});

const AddEditTimeTable = ({ open, onOpenChange }: AddEditTimeTableProps) => {
  // 
  const token = localStorage.getItem("adminToken");
  const [courseData, setCourseData] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(false);


  // 

  const semOptions: dropDownValues[] = [
    {
      value: "1",
      label: "1",
    },
    {
      value: "2",
      label: "2",
    },
    {
      value: "3",
      label: "3",
    },
    {
      value: "4",
      label: "4",
    },
    {
      value: "5",
      label: "5",
    },
    {
      value: "6",
      label: "6",
    },
  ];

  const semDetails = async (details: Option) => {
    try {

      const response = await axios.get(`${BASE_URL}admin/getSemDetails?courseId=${details.value}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      },);
      console.log(response);
    }
    catch (err) {
      console.log(err);
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



  const departmentOptions: dropDownValues[] = [
    {
      value: "bca",
      label: "BCA",
    },
    {
      value: "btech",
      label: "BTech",
    },
    {
      value: "bcom",
      label: "Bcom",
    },
  ];
  const teacherOptions: Teacher[] = [
    {
      value: "smith_math",
      label: "Mr. Smith - Mathematics",
    },
    {
      value: "john_eng",
      label: "Ms. John - English",
    },
    {
      value: "doe_sci",
      label: "Dr. Doe - Science",
    },
  ];
  const subjectOptions: dropDownValues[] = [
    {
      value: "math",
      label: "Mathematics",
    },
    {
      value: "eng",
      label: "English",
    },
    {
      value: "sci",
      label: "Science",
    },
  ];

  const lectures: Lecture[] = [
    {
      id: 1,
      name: "Lecture 1",
      time: "9:00 - 9:45",
    },
    {
      id: 2,
      name: "Lecture 2",
      time: "10:00 - 10:45",
    },
    {
      id: 3,
      name: "Lecture 3",
      time: "11:00 - 11:45",
    },
    {
      id: 4,
      name: "Lecture 4",
      time: "11:45 - 12:15",
    },
    // Add more lectures as needed
  ];
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      course: {},
      sem: {},
      venue: "",
      subject: {},
      teacher: {},
    },
  });

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    try {
      console.log(values);
    } catch (err) { }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white p-[20px] max-h-[90vh] min-h-[90vh]  overflow-y-scroll">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className=" w-full focus:outline-none flex flex-col justify-between"
          >
            <div className="w-full  flex flex-col">
              <p className="text-[#1E293B] font-semibold text-[24px]">
                Add Time Table Details
              </p>

              <div className="grid grid-cols-3 h-full gap-5">
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="course">
                        Select Course<span className="text-red-500">*</span>
                      </FormLabel>

                      <SelectDropdown
                        options={courseData?.map((course: any) => ({
                          value: course?._id,
                          label: course?.name,
                        }))}
                        placeholder="please select a value"
                        onChange={(selectedOption: any) => {
                          form.setValue("course", selectedOption);
                          semDetails(selectedOption)
                        }}
                        value={form.getValues("course")}
                      />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sem"
                  render={({ field }) => (
                    <FormItem className="w-1/2 col-span-2">
                      <FormLabel htmlFor="sem">
                        Select SEM<span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <SelectDropdown
                          options={semOptions}
                          onChange={(selectedOption: any) => {
                            form.setValue("sem", selectedOption); // Update sem value in the form state
                          }}
                          value={form.getValues("sem")}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                {lectures?.map((lecture: Lecture, key) => {
                  return (
                    <>
                      <FormLabel className="col-span-3">
                        {lecture?.name} ({lecture?.time})
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <div>
                        <FormField
                          control={form.control}
                          name="subject"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="subject">
                                Select Subject
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <SelectDropdown
                                  options={subjectOptions}
                                  onChange={(selectedOption: any) => {
                                    form.setValue("subject", selectedOption); // Update subject value in the form state
                                  }}
                                  value={form.getValues("subject")}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="teacher"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="teacher">
                                Select Teacher
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <SelectDropdown
                                  options={teacherOptions}
                                  onChange={(selectedOption: any) => {
                                    form.setValue("teacher", selectedOption); // Update teacher value in the form state
                                  }}
                                  value={form.getValues("teacher")}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="venue"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel htmlFor="Venue">
                                Venue<span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                {/* @ts-ignore */}
                                <Input type="venue" id="Venue" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </>
                  );
                })}
              </div>
            </div>

            <div className="w-full flex flex-row items-center justify-start mt-2 gap-2">
              <DialogFooter className="flex gap-2 flex-row">
                <Button type="submit">Save</Button>
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

export default AddEditTimeTable;
