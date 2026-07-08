"use client";

import { useEffect, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SupportStatusBadge } from "@/components/status-badge";
import { useUpdateSupportRequest } from "@/hooks/use-support";
import { formatDateTime } from "@/lib/utils";
import type { SupportRequest, SupportStatus } from "@/lib/types";
import { Mail, Phone, Paperclip, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { apiErrorMessage } from "@/lib/api-client";

const STATUS_OPTIONS: SupportStatus[] = ["open", "in_review", "resolved", "closed"];
const STATUS_LABEL: Record<SupportStatus, string> = {
  open: "Open",
  in_review: "In Review",
  resolved: "Resolved",
  closed: "Closed",
};

const ISSUE_LABEL: Record<string, string> = {
  damaged_book: "Damaged book",
  incorrect_book: "Incorrect book",
  delayed_delivery: "Delayed delivery",
  payment_problem: "Payment problem",
  other: "Other",
};

export function SupportDetailDrawer({
  request,
  onOpenChange,
}: {
  request: SupportRequest | null;
  onOpenChange: (open: boolean) => void;
}) {
  const [status, setStatus] = useState<SupportStatus>("open");
  const [note, setNote] = useState("");
  const updateRequest = useUpdateSupportRequest();

  useEffect(() => {
    if (request) {
      setStatus(request.status);
      setNote(request.adminNote ?? "");
    }
  }, [request]);

  if (!request) {
    return <Drawer open={false} onOpenChange={onOpenChange}><DrawerContent title="" /></Drawer>;
  }

  const requester = typeof request.user === "string" ? null : request.user;
  const dirty = status !== request.status || note !== (request.adminNote ?? "");

  async function handleSave() {
    if (!request) return;
    try {
      await updateRequest.mutateAsync({ id: request._id, status, adminNote: note });
      toast.success("Support request updated.");
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't update this request."));
    }
  }

  return (
    <Drawer open={!!request} onOpenChange={onOpenChange}>
      <DrawerContent
        title={ISSUE_LABEL[request.issueType] ?? request.issueType}
        description={formatDateTime(request.createdAt)}
      >
        <div className="space-y-6">
          <SupportStatusBadge status={request.status} />

          {requester && (
            <div>
              <p className="text-[13px] font-bold text-text-dark mb-1.5">Submitted by</p>
              <p className="text-[13.5px] text-text-dark">{requester.fullName}</p>
              <p className="text-[12.5px] text-text-medium">{requester.email}</p>
            </div>
          )}

          <div className="space-y-2 text-[13px]">
            {request.email && (
              <div className="flex items-center gap-2.5 text-text-dark">
                <Mail className="h-[14px] w-[14px] text-text-medium shrink-0" />
                {request.email}
              </div>
            )}
            {request.phoneNumber && (
              <div className="flex items-center gap-2.5 text-text-dark">
                <Phone className="h-[14px] w-[14px] text-text-medium shrink-0" />
                {request.phoneNumber}
              </div>
            )}
            {request.order && (
              <div className="flex items-center gap-2.5 text-text-dark">
                <ShoppingBag className="h-[14px] w-[14px] text-text-medium shrink-0" />
                Related order: {typeof request.order === "string" ? request.order : ""}
              </div>
            )}
            {request.evidenceUrl && (
              <a
                href={request.evidenceUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-primary font-bold hover:text-primary-dark"
              >
                <Paperclip className="h-[14px] w-[14px] shrink-0" />
                View attached evidence
              </a>
            )}
          </div>

          <div>
            <p className="text-[13px] font-bold text-text-dark mb-1.5">Description</p>
            <p className="text-[13.5px] text-text-dark leading-relaxed bg-background rounded-btn border border-border px-3.5 py-3">
              {request.description}
            </p>
          </div>

          <div className="border-t border-border pt-5 space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as SupportStatus)}>
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {STATUS_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="adminNote">Admin note</Label>
              <Textarea
                id="adminNote"
                rows={3}
                placeholder="Internal note about how this was handled…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            <Button className="w-full" onClick={handleSave} isLoading={updateRequest.isPending} disabled={!dirty}>
              Save changes
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
