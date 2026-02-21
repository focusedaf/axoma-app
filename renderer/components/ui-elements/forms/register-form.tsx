"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      toast.success("Account created successfully!");
      router.push("/onboarding/profile");
    } catch (error: any) {
      toast.error("Error creating account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-xl font-bold">Welcome to Axoma</h1>
            <FieldDescription>
              Already have an account?{" "}
              <a href="#" onClick={() => router.push("/login")}>
                Login
              </a>
            </FieldDescription>
          </div>

          <FieldGroup className="flex flex-col sm:flex-row gap-2">
            <Field>
              <FieldLabel>First Name</FieldLabel>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </Field>
            <Field>
              <FieldLabel>Last Name</FieldLabel>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </Field>
          </FieldGroup>

          <Field>
            <FieldLabel>Mobile Number</FieldLabel>
            <Input
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleInputChange}
              required
            />
          </Field>

          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </Field>

          <Field>
            <FieldLabel>Password</FieldLabel>
            <div className="relative">
              <Input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </Field>

          <FieldGroup>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:flex-1 h-11 font-semibold"
            >
              {isLoading ? <Spinner /> : "Register"}
            </Button>
          </FieldGroup>
        </FieldGroup>
      </form>
    </div>
  );
}
