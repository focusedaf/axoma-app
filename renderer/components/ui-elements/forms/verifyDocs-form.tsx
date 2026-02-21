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


function formatBytes(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Byte";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
}

export function useCopyToClipboard() {
  const [copied, setCopied] = useState(false);

  const copy = async (text: string) => {
    if (!navigator?.clipboard) return false;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      return true;
    } catch (error) {
      console.error("Failed to copy:", error);
      setCopied(false);
      return false;
    }
  };

  return { copy, copied };
}

interface FileUploadCompactProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
}

const VerifyDocsForm = ({
  maxFiles = 3,
  maxSize = 2 * 1024 * 1024,
  accept = "image/*",
  multiple = true,
  className,
  onFilesChange,
}: FileUploadCompactProps) => {
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
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    onFilesChange,
  });

  const isImage = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    return type.startsWith("image/");
  };

  const [isLoading, setIsLoading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleCloudinaryUpload = async () => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      files.forEach((fileItem) => {
        if (fileItem.file instanceof File) {
          formData.append("id_card", fileItem.file);
        }
      });

     
      setUploadedUrls(["success"]);
      console.log("Upload successful");
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <div className="flex items-start gap-3">
        {/* Compact Upload Area */}
        <div
          className={cn(
            "flex flex-1 items-center gap-3 rounded-lg border border-border border-dashed p-4 transition-colors",
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

          {/* Add Files Button */}
          <Button
            onClick={openFileDialog}
            size="sm"
            className={cn(isDragging && "animate-bounce")}
          >
            <PlusIcon className="h-4 w-4" />
            Add files
          </Button>

          {/* File Previews */}
          <div className="flex flex-1 items-center gap-2 overflow-x-auto">
            {files.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Drop files here or click to browse (max {maxFiles} files)
              </p>
            ) : (
              files.map((fileItem) => (
                <div key={fileItem.id} className="group shrink-0">
                  {/* File Preview */}
                  <div className="relative">
                    {isImage(fileItem.file) && fileItem.preview ? (
                      <img
                        src={fileItem.preview}
                        alt={fileItem.file.name}
                        className="h-12 w-12 rounded-lg border object-cover"
                        title={`${fileItem.file.name} (${formatBytes(
                          fileItem.file.size,
                        )})`}
                      />
                    ) : (
                      <div
                        className="flex h-12 w-12 items-center justify-center rounded-lg border bg-muted"
                        title={`${fileItem.file.name} (${formatBytes(
                          fileItem.file.size,
                        )})`}
                      >
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}

                    {/* Remove Button */}
                    <Button
                      onClick={() => removeFile(fileItem.id)}
                      variant="destructive"
                      size="icon"
                      className="size-5 border-2 border-background absolute -right-2 -top-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <XIcon className="size-3" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* File Count */}
          {files.length > 0 && (
            <div className="shrink-0 text-xs text-muted-foreground">
              {files.length}/{maxFiles}
            </div>
          )}
        </div>

        {/* Upload Button - only show when files are selected */}
        {files.length > 0 && (
          <Button
            onClick={handleCloudinaryUpload}
            disabled={isLoading || uploadedUrls.length > 0}
            className="mt-4 max-w-[200px]"
          >
            {isLoading ? (
              <>
                <Spinner className="mr-2" />
                Uploading
              </>
            ) : uploadedUrls.length > 0 ? (
              `✓ ${files.length} file${files.length > 1 ? "s" : ""} uploaded`
            ) : (
              `Upload ${files.length} file${files.length > 1 ? "s" : ""}`
            )}
          </Button>
        )}

        {/* Error Messages */}
        {errors.length > 0 && (
          <Alert variant="destructive" appearance="light" className="mt-5">
            <AlertIcon>
              <TriangleAlert />
            </AlertIcon>
            <AlertContent>
              <AlertTitle>File upload error(s)</AlertTitle>
              <AlertDescription>
                {errors.map((error, index) => (
                  <p key={index} className="last:mb-0">
                    {error}
                  </p>
                ))}
              </AlertDescription>
            </AlertContent>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default VerifyDocsForm;
