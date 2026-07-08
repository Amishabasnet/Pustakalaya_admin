"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCreateBook, useUpdateBook } from "@/hooks/use-books";
import type { Book } from "@/lib/types";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/api-client";

const bookSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  price: z.string().min(1, "Price is required"),
  originalPrice: z.string().optional(),
  discountPercent: z.string().optional(),
  coverImage: z.string().optional(),
  description: z.string().optional(),
  genre: z.string().optional(), // comma-separated in the form, split on submit
  isbn: z.string().optional(),
  stock: z.string().min(1, "Stock is required"),
});

type BookFormValues = z.infer<typeof bookSchema>;

export function BookFormDialog({
  open,
  onOpenChange,
  book,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  book?: Book | null;
}) {
  const isEditing = !!book;
  const createBook = useCreateBook();
  const updateBook = useUpdateBook();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: { discountPercent: "0", price: "0", stock: "0" },
  });

  useEffect(() => {
    if (open) {
      reset(
        book
          ? {
              title: book.title,
              author: book.author,
              price: String(book.price),
              originalPrice: book.originalPrice != null ? String(book.originalPrice) : "",
              discountPercent: String(book.discountPercent ?? 0),
              coverImage: book.coverImage ?? "",
              description: book.description ?? "",
              genre: book.genre?.join(", ") ?? "",
              isbn: book.isbn ?? "",
              stock: String(book.stock),
            }
          : {
              title: "",
              author: "",
              price: "0",
              originalPrice: "",
              discountPercent: "0",
              coverImage: "",
              description: "",
              genre: "",
              isbn: "",
              stock: "0",
            }
      );
    }
  }, [open, book, reset]);

  const isSubmitting = createBook.isPending || updateBook.isPending;

  async function onSubmit(values: BookFormValues) {
    const payload = {
      title: values.title,
      author: values.author,
      price: Number(values.price),
      originalPrice: values.originalPrice ? Number(values.originalPrice) : null,
      discountPercent: values.discountPercent ? Number(values.discountPercent) : 0,
      coverImage: values.coverImage,
      description: values.description,
      isbn: values.isbn,
      stock: Number(values.stock),
      genre: values.genre
        ? values.genre.split(",").map((g) => g.trim()).filter(Boolean)
        : [],
    };

    try {
      if (isEditing && book) {
        await updateBook.mutateAsync({ id: book._id, input: payload });
        toast.success("Book updated.");
      } else {
        await createBook.mutateAsync(payload);
        toast.success("Book added.");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't save the book."));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        title={isEditing ? "Edit book" : "Add book"}
        description={isEditing ? `Editing "${book?.title}"` : "Add a new title to the catalog."}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} placeholder="The Great Gatsby" />
              {errors.title && <p className="text-danger text-[12px] mt-1">{errors.title.message}</p>}
            </div>

            <div className="col-span-2">
              <Label htmlFor="author">Author</Label>
              <Input id="author" {...register("author")} placeholder="F. Scott Fitzgerald" />
              {errors.author && <p className="text-danger text-[12px] mt-1">{errors.author.message}</p>}
            </div>

            <div>
              <Label htmlFor="price">Price (NRs.)</Label>
              <Input id="price" type="number" step="0.01" {...register("price")} />
              {errors.price && <p className="text-danger text-[12px] mt-1">{errors.price.message}</p>}
            </div>

            <div>
              <Label htmlFor="originalPrice">Original price</Label>
              <Input id="originalPrice" type="number" step="0.01" {...register("originalPrice")} placeholder="Optional" />
            </div>

            <div>
              <Label htmlFor="discountPercent">Discount %</Label>
              <Input id="discountPercent" type="number" {...register("discountPercent")} />
            </div>

            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input id="stock" type="number" {...register("stock")} />
              {errors.stock && <p className="text-danger text-[12px] mt-1">{errors.stock.message}</p>}
            </div>

            <div className="col-span-2">
              <Label htmlFor="genre">Genres</Label>
              <Input id="genre" {...register("genre")} placeholder="Fiction, Classics (comma separated)" />
            </div>

            <div className="col-span-2">
              <Label htmlFor="isbn">ISBN</Label>
              <Input id="isbn" {...register("isbn")} placeholder="978-0-000-00000-0" />
            </div>

            <div className="col-span-2">
              <Label htmlFor="coverImage">Cover image URL</Label>
              <Input id="coverImage" {...register("coverImage")} placeholder="https://…" />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" rows={3} {...register("description")} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={isSubmitting}>
              {isEditing ? "Save changes" : "Add book"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
