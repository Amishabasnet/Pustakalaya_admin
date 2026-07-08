"use client";

import { useMemo, useState, useCallback } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { BookFormDialog } from "@/components/books/book-form";
import { ConfirmDialog } from "@/components/confirm-dialog";
import {
  useBooks,
  useDeleteBook,
  useToggleBookVerify,
  useToggleBookFeature,
} from "@/hooks/use-books";
import type { Book } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/api-client";
import { useDebounce } from "@/hooks/use-debounce";

export default function BooksPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput, 400);
  const [verifiedFilter, setVerifiedFilter] = useState<"all" | "verified" | "unverified">("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);

  const { data, isLoading } = useBooks({
    page,
    limit: 10,
    search,
    verified: verifiedFilter,
  });

  const deleteBook = useDeleteBook();
  const toggleVerify = useToggleBookVerify();
  const toggleFeature = useToggleBookFeature();

  function openAdd() {
    setEditingBook(null);
    setFormOpen(true);
  }

  function openEdit(book: Book) {
    setEditingBook(book);
    setFormOpen(true);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await deleteBook.mutateAsync(deleteTarget._id);
      toast.success(`"${deleteTarget.title}" removed.`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't delete this book."));
    }
  }

  const handleToggleVerify = useCallback(async (book: Book) => {
    try {
      await toggleVerify.mutateAsync(book._id);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't update verification."));
    }
  }, [toggleVerify]);

  const handleToggleFeature = useCallback(async (book: Book) => {
    try {
      await toggleFeature.mutateAsync(book._id);
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't update featured status."));
    }
  }, [toggleFeature]);

  const columns = useMemo<ColumnDef<Book>[]>(
    () => [
      {
        header: "Title",
        accessorKey: "title",
        cell: ({ row }) => (
          <div className="flex items-center gap-3 min-w-[220px]">
            <div className="h-11 w-8 rounded-[4px] bg-primary/10 shrink-0 overflow-hidden flex items-center justify-center">
              {row.original.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={row.original.coverImage} alt="" className="h-full w-full object-cover" />
              ) : (
                <span className="text-primary text-[10px] font-bold">
                  {row.original.title.slice(0, 2).toUpperCase()}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-text-dark truncate max-w-[220px]">{row.original.title}</p>
              <p className="text-[12px] text-text-medium truncate max-w-[220px]">{row.original.author}</p>
            </div>
          </div>
        ),
      },
      {
        header: "Price",
        accessorKey: "price",
        cell: ({ row }) => (
          <span className="font-bold">{formatCurrency(row.original.price)}</span>
        ),
      },
      {
        header: "Stock",
        accessorKey: "stock",
        cell: ({ row }) => (
          <span className={row.original.stock < 5 ? "text-danger font-bold" : ""}>
            {row.original.stock}
          </span>
        ),
      },
      {
        header: "Genre",
        accessorKey: "genre",
        cell: ({ row }) => (
          <span className="text-text-medium text-[12.5px]">
            {row.original.genre?.slice(0, 2).join(", ") || "—"}
          </span>
        ),
      },
      {
        header: "Verified",
        id: "verified",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isVerified}
            onCheckedChange={() => handleToggleVerify(row.original)}
          />
        ),
      },
      {
        header: "Featured",
        id: "featured",
        cell: ({ row }) => (
          <Switch
            checked={row.original.isFeatured}
            onCheckedChange={() => handleToggleFeature(row.original)}
          />
        ),
      },
      {
        header: "",
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                openEdit(row.original);
              }}
              className="h-8 w-8 flex items-center justify-center rounded-btn hover:bg-black/5 text-text-medium hover:text-text-dark"
              aria-label="Edit"
            >
              <Pencil className="h-[15px] w-[15px]" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTarget(row.original);
              }}
              className="h-8 w-8 flex items-center justify-center rounded-btn hover:bg-danger-light text-text-medium hover:text-danger"
              aria-label="Delete"
            >
              <Trash2 className="h-[15px] w-[15px]" />
            </button>
          </div>
        ),
      },
    ],
    [handleToggleVerify, handleToggleFeature]
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-[280px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-medium" />
          <Input
            placeholder="Search title or author…"
            className="pl-10"
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={verifiedFilter}
            onValueChange={(v) => {
              setVerifiedFilter(v as typeof verifiedFilter);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All books</SelectItem>
              <SelectItem value="verified">Verified only</SelectItem>
              <SelectItem value="unverified">Unverified only</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={openAdd}>
            <Plus className="h-4 w-4" />
            Add book
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
        emptyTitle="No books found"
        emptyDescription="Try a different search, or add a new title to the catalog."
        page={data?.page ?? page}
        totalPages={data?.totalPages ?? 1}
        onPageChange={setPage}
      />

      <BookFormDialog open={formOpen} onOpenChange={setFormOpen} book={editingBook} />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete this book?"
        description={`"${deleteTarget?.title}" will be permanently removed from the catalog. This can't be undone.`}
        confirmLabel="Delete"
        isLoading={deleteBook.isPending}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
