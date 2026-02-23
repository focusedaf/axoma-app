"use client";

import { useState } from "react";
import {
  useFileUpload,
  FileWithPreview,
  FileMetadata,
} from "@/components/ui/file-upload";
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "@/components/ui/alert-1";
import { Button } from "@/components/ui/button-1";
import { FileIcon, PlusIcon, TriangleAlert, XIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";
import { addDocuments } from "@/lib/api";
import { useRouter } from "next/navigation";

interface Props {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
}

export default function VerifyDocsForm({
  maxFiles = 3,
  maxSize = 2 * 1024 * 1024,
  accept = "image/*,application/pdf",
  multiple = true,
  className,
}: Props) {
  const router = useRouter();

  const [
    { files, isDragging, errors },
    {
      removeFile,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
      clearFiles,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const isImage = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    return type.startsWith("image/");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!files.length) {
      setServerError("Please upload at least one document");
      return;
    }

    setIsLoading(true);
    setServerError(null);

    try {
      const formData = new FormData();

      files.forEach((fileItem) => {
        if (fileItem.file instanceof File) {
          formData.append("documents", fileItem.file);
        }
      });

      await addDocuments(formData);

      clearFiles();

      router.push("/onboarding/success");
    } catch (error: any) {
      setServerError(
        error?.response?.data?.message || "Failed to upload documents",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form id="verify-docs-form" onSubmit={handleSubmit}>
      <div className={cn("w-full", className)}>
        <div className="flex items-start gap-4">
          {/* Dropzone */}
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg border border-dashed p-4 transition-colors flex-1",
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-muted-foreground/50",
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input {...getInputProps()} className="sr-only" />

            <Button type="button" onClick={openFileDialog} size="sm">
              <PlusIcon className="h-4 w-4 mr-1" />
              Add files
            </Button>

            <div className="flex flex-1 items-center gap-2 overflow-x-auto">
              {files.map((fileItem) => (
                <div key={fileItem.id} className="relative group">
                  {isImage(fileItem.file) && fileItem.preview ? (
                    <img
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      className="h-12 w-12 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted">
                      <FileIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}

                  <Button
                    type="button"
                    onClick={() => removeFile(fileItem.id)}
                    variant="destructive"
                    size="icon"
                    className="absolute -right-2 -top-2 size-5 rounded-full opacity-0 group-hover:opacity-100"
                  >
                    <XIcon className="size-3" />
                  </Button>
                </div>
              ))}
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="whitespace-nowrap"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Uploading...
                </>
              ) : (
                "Upload"
              )}
            </Button>
          </div>
        </div>

        {serverError && (
          <Alert variant="destructive" appearance="light" className="mt-4">
            <AlertIcon>
              <TriangleAlert />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>Upload Failed</AlertTitle>
              <AlertDescription>{serverError}</AlertDescription>
            </AlertContent>
          </Alert>
        )}
      </div>
    </form>
  );
}
