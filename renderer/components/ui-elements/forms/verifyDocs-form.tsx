"use client";

import { useState } from "react";
import { useFileUpload, FileMetadata } from "@/components/ui/file-upload";
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

interface Props {
  onUploadSuccess?: () => void;
}

export default function VerifyDocsForm({ onUploadSuccess }: Props) {
  const [
    { files, isDragging },
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
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
    accept: "image/*,application/pdf",
    multiple: true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);

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

      setUploaded(true);
      onUploadSuccess?.();
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
      <div className={cn("w-full")}>
        <div
          className={cn(
            "flex items-center gap-3 rounded-lg border border-dashed p-4",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25",
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

          <div className="flex flex-1 gap-2 overflow-x-auto">
            {files.map((fileItem) => (
              <div key={fileItem.id} className="relative group">
                {isImage(fileItem.file) && fileItem.preview ? (
                  <img
                    src={fileItem.preview}
                    className="h-12 w-12 rounded-lg border object-cover"
                  />
                ) : (
                  <div className="h-12 w-12 flex items-center justify-center border rounded-lg bg-muted">
                    <FileIcon className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}

                <Button
                  type="button"
                  onClick={() => removeFile(fileItem.id)}
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 size-5 opacity-0 group-hover:opacity-100"
                >
                  <XIcon className="size-3" />
                </Button>
              </div>
            ))}
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Uploading...
              </>
            ) : uploaded ? (
              "Uploaded ✓"
            ) : (
              "Upload"
            )}
          </Button>
        </div>

        {serverError && (
          <Alert variant="destructive" className="mt-4">
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
