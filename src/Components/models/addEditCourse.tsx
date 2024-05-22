import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as z from "zod";
import SelectDropdown from "../ComonComponents/selectDropdown";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";

import Loader from "../../Components/loader";
import { createCourse, getSubject } from "../../HttpServices";
import { dropDownValues } from "../../Utils/interface";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface AddEditCourse {
  open: boolean;
  onOpenChange: () => void;
  getCoursesList: () => void;
}
interface Subject {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const semester = z.object({
  id: z.string().uuid(),
  semesterName: z.string(),
  subjects: z.array(
    z.object({
      value: z.string(),
      label: z.string(),
    })
  ),
});
const validationSchema = z.object({
  totalSem: z.string(),
  fullName: z.string().min(1, { message: "Name is required" }),
  courseYear: z.string().min(1, { message: "this is a required." }),
  semesters: z.array(semester),
});

const AddEditCourse = ({
  open,
  onOpenChange,
  getCoursesList,
}: AddEditCourse) => {
  const token = localStorage.getItem("adminToken");
  const [subjects, setSubjects] = useState<Array<Subject>>([]);

  const form = useForm<z.infer<typeof validationSchema>>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      totalSem: "",
      fullName: "",
      courseYear: "",
      semesters: [{ id: "", semesterName: "", subjects: [] }],
    },
  });
  const [selectedValues, setSelectedValues] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const addDropdown = (
    semesterDetail: any,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const semesters = form.getValues("semesters");
    const semesterIndex = semesters.findIndex(
      (semester) => semester.id === semesterDetail.id
    );

    if (semesterIndex !== -1) {
      semesters[semesterIndex].subjects.push({
        value: "",
        label: "",
      });
      form.setValue("semesters", semesters);
    }
  };

  const removeDropdown = (
    semesterIndex: number,
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    const semesters = form.getValues("semesters");
    if (semesterIndex !== -1) {
      semesters[semesterIndex].subjects.pop();

      form.setValue("semesters", semesters);
    }
  };

  const addSubject = (semesterDetail: any, subject: any) => {
    const semesters = form.getValues("semesters");
    const semesterIndex = semesters.findIndex(
      (semester: any) => semester.id === semesterDetail.id
    );
    if (semesterIndex !== -1) {
      if (!semesterDetail.subjects) {
        semesterDetail.subjects = [];
      }
      const subjectToAddIndex: number = semesterDetail.subjects.findIndex(
        (el: dropDownValues) => !el.value && !el.label
      );
      if (subjectToAddIndex !== -1)
        semesterDetail.subjects[subjectToAddIndex] = subject;
      form.setValue("semesters", semesters);
    }
  };

  const onSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    try {
      e.preventDefault();

      const values = form.getValues();

      if (!values.totalSem || !values.fullName || !values.courseYear) {
        toast.error("Please fill in all required fields.");
        return;
      }

      if (
        values.semesters.some(
          (semester: any) =>
            !semester.id ||
            !semester.semesterName ||
            semester.subjects.length === 0
        )
      ) {
        toast.error(
          "Please fill in all fields for each semester and add subjects."
        );
        return;
      }

      // Transform subjects array to contain only ObjectId strings
      const transformedValues = {
        ...values,
        semesters: values.semesters.map((semester: any) => {
          const { id, ...rest } = semester;
          return {
            ...rest,
            subjects: rest.subjects.map((subject: any) => subject.value), // Assuming 'value' contains ObjectId
          };
        }),
      };

      setLoading(true);

      // Assuming createCourse is an async function that makes a POST request to your backend
      const res = await createCourse(token as string, transformedValues);
      if (res.data.status === 201 || res.data.status === 200) {
        toast.success(res.data.message);
        getCoursesList()
        onOpenChange();
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message as string);
    } finally {
      setLoading(false);
    }
  };

  // Example createCourse function making a POST request using axios
  // const createCourse = async (token: string, data: any) => {
  //   return await axios.post("your-backend-url/createCourse", data, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //     },
  //   });
  // };

  const calculateTotalSem = (courseYear: string): string => {
    return courseYear ? `${(parseInt(courseYear, 10) * 2).toString()}` : "";
  };

  const getAllSub = async () => {
    try {
      setLoading(true);
      const response = await getSubject(token as string); // Adjust this based on your API endpoint
      if (response?.data?.status === 200) {
        setSubjects(response?.data?.subjects);
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllSub();
  }, []);

  useEffect(() => {
    const courseYearValue = form.watch("courseYear");
    const totalSemValue = calculateTotalSem(courseYearValue);
    form.setValue("totalSem", totalSemValue);
    if (totalSemValue.trim() !== "") {
      const newSem: any = Array.from(
        { length: parseInt(totalSemValue) },
        (_, i) => ({
          id: Math.random().toString(),
          semesterName: `SEM ${i + 1}`,
          subjects: [],
        })
      );
      form.setValue("semesters", newSem);
      // console.log(form.getValues());
    }
  }, [form.watch("courseYear")]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white p-[20px] max-h-[90vh]  overflow-y-scroll">
        <div className="w-full flex flex-col">
          <p className="text-[#1E293B] font-semibold text-[24px]">
            Add Course Details
          </p>

          <div className="grid grid-cols-3 gap-5">
            {/* Your form fields */}
            <div>
              <Label htmlFor="fullName">Name</Label>
              <Input type="text" id="fullName" {...form.register("fullName")} />
            </div>
            <div>
              <Label htmlFor="courseYear">Course Year</Label>
              <Input
                type="number"
                id="courseYear"
                {...form.register("courseYear")}
              />
            </div>
            <div>
              <Label htmlFor="totalSem">Total Sem</Label>
              <Input
                type="number"
                id="totalSem"
                disabled
                value={form.watch("totalSem")}
              />
            </div>
          </div>
        </div>
        <>
          {form.watch("totalSem")?.trim() !== "" &&
            form.watch("semesters").map((sem, index) => {
              return (
                <div key={index} className="flex w-full flex-col gap-y-2 mt-2">
                  <Label className="text-[18px]">{sem?.semesterName}</Label>
                  <div className="grid grid-cols-3 gap-5">
                    {sem?.subjects?.map((subject, key) => {
                      return (
                        <SelectDropdown
                          key={key}
                          options={subjects?.map((sub) => ({
                            value: sub?._id,
                            label: sub?.name,
                          }))}
                          onChange={(selectedOption: dropDownValues | null) => {
                            addSubject(sem, selectedOption);
                          }}
                          value={subject}
                        />
                      );
                    })}

                    <Button onClick={(e) => addDropdown(sem, e)}>
                      Add Subject
                    </Button>
                    <Button
                      onClick={(e) => removeDropdown(index, e)}
                      variant="destructive"
                    >
                      Remove Subject
                    </Button>
                  </div>
                </div>
              );
            })}
        </>
        <div className="w-full flex flex-row items-center justify-start mt-2 gap-2">
          <DialogFooter className="flex gap-2 flex-row">
            <Button onClick={(e) => onSubmit(e)}>
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
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCourse;
