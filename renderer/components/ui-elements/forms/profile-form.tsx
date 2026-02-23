"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { upsertProfile } from "@/lib/api";

export default function ProfileForm({ className }: { className?: string }) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    universityName: "",
    collegeName: "",
    majorName: "",
    currentSem: "",
    startYear: "",
    gradYear: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await upsertProfile({
        ...formData,
        currentSem: Number(formData.currentSem),
      });

      toast.success("Profile saved successfully");
      router.push("/onboarding/verify-docs");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save profile");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      id="profile-form" 
      onSubmit={handleSubmit}
      className={cn("flex flex-col gap-6", className)}
    >
      <FieldGroup className="grid md:grid-cols-2 gap-6">
        <Field>
          <FieldLabel>University Name</FieldLabel>
          <Input
            name="universityName"
            placeholder="e.g. Stanford University"
            value={formData.universityName}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <FieldLabel>College Name</FieldLabel>
          <Input
            name="collegeName"
            placeholder="e.g. School of Engineering"
            value={formData.collegeName}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Major</FieldLabel>
          <Input
            name="majorName"
            placeholder="e.g. Computer Science"
            value={formData.majorName}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Current Semester</FieldLabel>
          <Input
            name="currentSem"
            placeholder="e.g. 6"
            value={formData.currentSem}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Start Year</FieldLabel>
          <Input
            name="startYear"
            placeholder="2022"
            value={formData.startYear}
            onChange={handleChange}
            required
          />
        </Field>

        <Field>
          <FieldLabel>Graduation Year</FieldLabel>
          <Input
            name="gradYear"
            placeholder="2026"
            value={formData.gradYear}
            onChange={handleChange}
            required
          />
        </Field>
      </FieldGroup>
    </form>
  );
}
