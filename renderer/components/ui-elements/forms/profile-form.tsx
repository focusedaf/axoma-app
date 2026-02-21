"use client";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";


interface StudentProfile {
  universityName?: string;
  collegeName?: string;
  majorName?: string;
  currentSem?: string;
  startYear?: string;
  gradYear?: string;
}

interface StudentProfileFormProps {
  className?: string;
  existingData?: StudentProfile;
  onSuccess?: () => void;
}

const StudentProfileForm = ({
  className,
  existingData,
  onSuccess,
}: StudentProfileFormProps) => {
  const [formData, setFormData] = useState<StudentProfile>({
    universityName: "",
    collegeName: "",
    majorName: "",
    currentSem: "",
    startYear: "",
    gradYear: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (existingData) setFormData(existingData);
  }, [existingData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload = {
        universityName: formData.universityName,
        collegeName: formData.collegeName,
        majorName: formData.majorName,
        currentSem: Number(formData.currentSem),
        startYear: formData.startYear,
        gradYear: formData.gradYear,
      };

      let res;

      try {
       
        toast.success("Profile saved successfully!");
      } catch (err: any) {
        if (err?.response?.status === 409) {
         
          toast.success("Profile updated successfully!");
        } else {
          throw err;
        }
      }

      

      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Error saving profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-8 w-full md:max-w-7xl", className)}>
      <form onSubmit={handleSubmit} id="profile-form">
        <FieldGroup className="flex flex-col sm:flex-row gap-2 justify-between items-stretch">
          <Field className="w-full max-w-xl">
            <FieldLabel htmlFor="universityName">University Name</FieldLabel>
            <Input
              id="universityName"
              name="universityName"
              value={formData.universityName}
              onChange={handleChange}
              required
            />
          </Field>
          <Field className="w-full max-w-xl">
            <FieldLabel htmlFor="collegeName">College Name</FieldLabel>
            <Input
              id="collegeName"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              required
            />
          </Field>
        </FieldGroup>

        <FieldGroup className="flex flex-col sm:flex-row gap-2 justify-between items-stretch">
          <Field className="w-full max-w-xl">
            <FieldLabel htmlFor="majorName">Major Name</FieldLabel>
            <Input
              id="majorName"
              name="majorName"
              value={formData.majorName}
              onChange={handleChange}
              required
            />
          </Field>
          <Field className="w-full max-w-xl">
            <FieldLabel htmlFor="currentSem">Current Semester</FieldLabel>
            <Input
              id="currentSem"
              name="currentSem"
              value={formData.currentSem}
              onChange={handleChange}
              required
            />
          </Field>
        </FieldGroup>

        <FieldGroup className="flex flex-col sm:flex-row gap-2 justify-between items-stretch">
          <Field className="w-full max-w-xl">
            <FieldLabel htmlFor="startYear">Batch Start Year</FieldLabel>
            <Input
              id="startYear"
              name="startYear"
              value={formData.startYear}
              onChange={handleChange}
              pattern="\d{4}"
              required
            />
          </Field>
          <Field className="w-full max-w-xl">
            <FieldLabel htmlFor="gradYear">Expected Graduation Year</FieldLabel>
            <Input
              id="gradYear"
              name="gradYear"
              value={formData.gradYear}
              onChange={handleChange}
              pattern="\d{4}"
              required
            />
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
};

export default StudentProfileForm;
