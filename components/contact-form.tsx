"use client";

import { ConstructionButton } from "@/components/construction-button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export const ContactForm = () => {
  async function handleSubmit(formData: FormData) {
    const data = Object.fromEntries(formData);
    console.log("Form Submitted:", data);
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          name="name"
          placeholder="Full Name"
          required
          className="h-14 rounded-none border-border text-foreground focus:border-primary"
        />
        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          className="h-14 rounded-none border-border text-foreground focus:border-primary"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          name="phone"
          placeholder="Phone Number"
          className="h-14 rounded-none border-border text-foreground focus:border-primary"
        />
        <Select name="service">
          <SelectTrigger className="min-h-14 w-full rounded-none border-border text-foreground focus:border-primary">
            <SelectValue placeholder="Project Type" />
          </SelectTrigger>
          <SelectContent className="w-full">
            <SelectItem value="residential">Residential Build</SelectItem>
            <SelectItem value="commercial">Commercial Development</SelectItem>
            <SelectItem value="renovation">Renovation & Retrofit</SelectItem>
            <SelectItem value="consultation">Project Consultation</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Textarea
        name="message"
        placeholder="Tell us about your project..."
        className="min-h-[150px] resize-none rounded-none border-border text-foreground focus:border-primary"
        required
      />

      <div className="pt-4">
        <ConstructionButton label="Send Message" className="w-full md:w-auto" />
      </div>
    </form>
  );
};
