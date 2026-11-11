"use client";

import { Printer } from "lucide-react";
import { buttonClasses } from "@/components/ui/ButtonLink";

/** Opens the print dialog (choose "Save as PDF" to get a file for the printer). */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={buttonClasses("primary")}>
      <Printer size={20} aria-hidden />
      اطبع أو احفظ PDF
    </button>
  );
}
