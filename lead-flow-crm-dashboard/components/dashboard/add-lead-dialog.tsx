"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Lead } from "./lead-card";

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddLead: (lead: Omit<Lead, "id" | "timeAgo">) => void;
}

export function AddLeadDialog({ open, onOpenChange, onAddLead }: AddLeadDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    phone: "",
  });

  const isValid = formData.name.trim().length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    
    onAddLead({
      name: formData.name.trim(),
      company: formData.company.trim() || "No company",
      email: "",
      status: "new",
      latestNote: "",
      hasFollowUp: false,
      phone: formData.phone.trim(),
    });
    
    setFormData({
      name: "",
      company: "",
      phone: "",
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      company: "",
      phone: "",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-0 gap-0 rounded-xl overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60">
          <DialogTitle className="text-lg font-semibold">Add new lead</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Add a new lead to your pipeline.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                placeholder="e.g. Sarah Johnson"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="h-10 rounded-lg border-border/60 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors"
                autoFocus
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium text-foreground/80">
                Company
              </Label>
              <Input
                id="company"
                placeholder="e.g. Acme Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="h-10 rounded-lg border-border/60 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-foreground/80">
                Phone number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. +1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="h-10 rounded-lg border-border/60 focus-visible:ring-primary/20 focus-visible:ring-offset-0 focus-visible:border-primary transition-colors"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel} 
              className="flex-1 h-10 rounded-lg border-border/60 hover:bg-muted/50 transition-colors"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!isValid}
              className="flex-1 h-10 rounded-lg bg-primary hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Lead
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
