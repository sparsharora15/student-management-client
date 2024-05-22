import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import SelectDropdown from "../ComonComponents/selectDropdown";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";

//course data imports

import { getCourses, getSubject, getTeacher } from "../../HttpServices";
//

import * as z from "zod";

import axios from "axios";
import { BASE_URL } from "../../Utils/constants";
import { dropDownValues } from "../../Utils/interface";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";

//
interface Option {
  value: string;
  label: string;
}
//
interface Lectures {
  lectureNumber: number;
  endTime: string;
  startTime: string;
  _id: string;
}
interface AddEditTimeTableProps {
  open: boolean;
  onOpenChange: () => void;
  lectures: Lectures[];
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
const subjectSchema = z.object({
  label: z.string(),
  value: z.string(),
});
const lectureSchema = z.object({
  lectureNumber: z.string(),
  subject: subjectSchema,
  teacher: subjectSchema,
  venue: z.string(),
});

const validationSchema = z.object({
  course: z.object({
    label: z.string(),
    value: z.string(),
  }),
  sem: z.object({
    label: z.string(),
    value: z.string(),
  }),
  lecture: z.array(lectureSchema),
});

const AddEditTimeTable = ({
  open,
  onOpenChange,
  lectures,
}: AddEditTimeTableProps) => {
  //
  const token = localStorage.getItem("adminToken");
  const [courseData, setCourseData] = useState<Option[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [semOptions, setSemOptions] = useState<dropDownValues[]>([]);
  const [subjectsData, setSubjectsData] = useState<dropDownValues[]>([]);
  const [teachers, setTeachers] = useState<dropDownValues[]>([]);

  const semDetails = async (details: Option) => {
    try {
      const response = await axios.get(
        `${BASE_URL}admin/getSemDetails?courseId=${details.value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setSemOptions(
          response.data.map((sem: { semesterName: string; _id: string }) => ({
            label: sem.semesterName,
            value: sem._id,
          }))
        );
      }
    } catch (err) {
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
  const getAllSub = async () => {
    try {
      setLoading(true);
      const response = await getSubject(token as string);
      if (response?.data?.status === 200) {
        const formattedSubjects = response?.data?.subjects.map(
          (subject: { name: string; _id: string }) => ({
            label: subject.name,
            value: subject._id,
          })
        );
        setSubjectsData(formattedSubjects);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  const getAllTechersData = async () => {
    try {
      const res = await getTeacher(token as string);
      if (res.data.status === 200) {
        const formattedData = res.data.data.map(
          (teacher: { fullName: string; _id: string }) => ({
            label: teacher.fullName,
            value: teacher._id,
          })
        );
        setTeachers(formattedData);
      }
    } catch (err) {
      console.warn(err);
    }
  };
  useEffect(() => {
    getAllSub();
    getCoursesList();
    getAllTechersData();
  }, []);
  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      course: {},
      sem: {},
      lecture: [
        {
          lectureNumber:"",
          venue: "",
          subject: {},
          teacher: {},
        },
      ],
    },
  });

  const onSubmit = async (values: z.infer<typeof validationSchema>) => {
    try {
      console.log(values);
    } catch (err) {}
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
                          semDetails(selectedOption);
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
                {/* {lectures?.map((lecture: Lectures, index: number) => {
                  return (
                    <React.Fragment key={index}>
                      <FormLabel className="col-span-3">
                        {`Lecture ${lecture?.lectureNumber} (${lecture?.startTime} - ${lecture?.endTime})`}
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
                                  options={subjectsData}
                                  onChange={(
                                    selectedOption: dropDownValues | null
                                  ) => {
                                    selectedOption &&
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
                                  options={teachers}
                                  onChange={(
                                    selectedOption: dropDownValues | null
                                  ) => {
                                    selectedOption &&
                                      form.setValue("teacher", selectedOption);
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
                                <Input type="venue" id="Venue" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </React.Fragment>
                  );
                })} */}
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
