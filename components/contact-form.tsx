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
    // Logic for React 19 Server Actions goes here
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
          className="focus:border-accent h-14 rounded-none border-slate-200"
        />
        <Input
          name="email"
          type="email"
          placeholder="Email Address"
          required
          className="focus:border-accent h-14 rounded-none border-slate-200"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Input
          name="phone"
          placeholder="Phone Number"
          className="focus:border-accent h-14 rounded-none border-slate-200"
        />
        <Select name="service">
          <SelectTrigger className="h-14 rounded-none border-slate-200">
            <SelectValue placeholder="Project Type" />
          </SelectTrigger>
          <SelectContent>
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
        className="focus:border-accent min-h-[150px] resize-none rounded-none border-slate-200"
        required
      />

      <div className="pt-4">
        <ConstructionButton label="Send Message" className="w-full md:w-auto" />
      </div>
    </form>
  );
};
