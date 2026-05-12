"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateLeadMutation } from "@/lib/query/hooks";

type AddLeadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function AddLeadDialog({ open, onOpenChange }: AddLeadDialogProps) {
  const createLead = useCreateLeadMutation();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");

  const reset = () => {
    setName("");
    setCompany("");
    setPhone("");
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) {
      reset();
    }
    onOpenChange(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createLead.mutate(
      {
        name: name.trim(),
        company: company.trim() ? company.trim() : null,
        phone: phone.trim() ? phone.trim() : null,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-xl p-0 sm:max-w-[400px]">
        <DialogHeader className="border-b border-border/60 px-6 pt-6 pb-4">
          <DialogTitle className="text-lg font-semibold">Add new lead</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a lead in your pipeline. Status defaults to New.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lead-name">
                Full name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lead-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Johnson"
                autoFocus
                className="h-10 rounded-lg border-border/60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-company">Company</Label>
              <Input
                id="lead-company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Acme Inc."
                className="h-10 rounded-lg border-border/60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lead-phone">Phone</Label>
              <Input
                id="lead-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="e.g. +91 98765 43210"
                className="h-10 rounded-lg border-border/60"
              />
            </div>
          </div>

          {createLead.isError ? (
            <p className="mt-3 text-sm text-destructive" role="alert">
              {createLead.error instanceof Error
                ? createLead.error.message
                : "Could not create lead."}
            </p>
          ) : null}

          <div className="flex gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              className="h-10 flex-1 rounded-lg"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-10 flex-1 rounded-lg"
              disabled={!name.trim() || createLead.isPending}
            >
              {createLead.isPending ? "Saving…" : "Save lead"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
