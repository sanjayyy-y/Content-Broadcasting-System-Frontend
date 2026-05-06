"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { subjects } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useContent } from "@/hooks/useContent";

const validTypes = ["image/jpeg", "image/png", "image/gif"];
const maxSize = 10 * 1024 * 1024;

const uploadSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    subject: z.string().min(1, "Subject is required"),
    description: z.string().optional(),
    file: z
      .any()
      .refine((file) => file instanceof File, "Image file is required")
      .refine((file) => !file || validTypes.includes(file.type), "Only JPG, PNG or GIF files are allowed")
      .refine((file) => !file || file.size <= maxSize, "File size must be 10MB or less"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    rotationDuration: z.coerce.number().min(5, "Minimum 5 seconds").max(120, "Maximum 120 seconds")
  })
  .refine((data) => new Date(data.endTime) > new Date(data.startTime), {
    message: "End time must be after start time",
    path: ["endTime"]
  });

export function UploadForm() {
  const { user } = useAuth();
  const { uploadContent } = useContent();
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);

  const defaults = useMemo(() => {
    const start = new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);
    const end = new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16);
    return { title: "", subject: "", description: "", file: null, startTime: start, endTime: end, rotationDuration: 10 };
  }, []);

  const {
    register,
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(uploadSchema),
    defaultValues: defaults
  });

  const setFile = useCallback(
    (file) => {
      if (!file) return;
      setValue("file", file, { shouldValidate: true });
      setPreview(URL.createObjectURL(file));
    },
    [setValue]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      setDragging(false);
      setFile(event.dataTransfer.files?.[0]);
    },
    [setFile]
  );

  const onSubmit = async (values) => {
    try {
      await uploadContent({
        ...values,
        teacherId: user.id,
        teacherName: user.name,
        fileUrl: preview,
        fileType: values.file.type,
        startTime: new Date(values.startTime).toISOString(),
        endTime: new Date(values.endTime).toISOString()
      });
      toast({ title: "Content uploaded", description: "Sent to principal for approval." });
      reset(defaults);
      setPreview("");
    } catch (error) {
      toast({ title: "Upload failed", description: error.message, variant: "error" });
    }
  };

  return (
    <Card>
      <CardContent className="p-5">
        <form className="grid gap-5 lg:grid-cols-[1fr_360px]" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" {...register("title")} />
                {errors.title ? <p className="text-sm text-red-600">{errors.title.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label>Subject</Label>
                <Controller
                  name="subject"
                  control={control}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => <SelectItem key={subject} value={subject}>{subject}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.subject ? <p className="text-sm text-red-600">{errors.subject.message}</p> : null}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" {...register("description")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input id="startTime" type="datetime-local" {...register("startTime")} />
                {errors.startTime ? <p className="text-sm text-red-600">{errors.startTime.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input id="endTime" type="datetime-local" {...register("endTime")} />
                {errors.endTime ? <p className="text-sm text-red-600">{errors.endTime.message}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="rotationDuration">Rotation Duration</Label>
                <Input id="rotationDuration" type="number" min="5" max="120" {...register("rotationDuration")} />
                {errors.rotationDuration ? <p className="text-sm text-red-600">{errors.rotationDuration.message}</p> : null}
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting}>
              <UploadCloud className="h-4 w-4" />
              {isSubmitting ? "Uploading..." : "Upload for approval"}
            </Button>
          </div>
          <div
            className={cn(
              "flex min-h-72 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/40 p-4 text-center",
              dragging && "border-primary bg-secondary"
            )}
            onDragOver={(event) => {
              event.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
          >
            {preview ? (
              <div className="w-full space-y-3">
                <img src={preview} alt="Upload preview" className="aspect-video w-full rounded-md object-cover" />
                <Button type="button" variant="outline" size="sm" onClick={() => { setPreview(""); setValue("file", null); }}>
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              </div>
            ) : (
              <>
                <ImagePlus className="mb-3 h-10 w-10 text-muted-foreground" />
                <p className="font-medium">Drop image here</p>
                <p className="mt-1 text-sm text-muted-foreground">JPG, PNG or GIF up to 10MB</p>
                <Label className="mt-4 cursor-pointer rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
                  Browse file
                  <Input
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    className="sr-only"
                    onChange={(event) => setFile(event.target.files?.[0])}
                  />
                </Label>
              </>
            )}
            {errors.file ? <p className="mt-3 text-sm text-red-600">{errors.file.message}</p> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
