import type { Metadata } from "next"
import { LegalPage } from "@/components/legal"
import { RefundPolicyDocument } from "@/components/refund-policy-document"

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | MOOKALAA",
  description:
    "How cancellations, refunds and related claims are handled for bookings made on MOOKALAA, issued by Venootic Enterprises (OPC) Private Limited.",
}

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Refund & Cancellation Policy"
      intro="How cancellations, refunds and related claims are handled for bookings made on MOOKALAA."
      updated="Policy Version 1.0"
    >
      <RefundPolicyDocument />
    </LegalPage>
  )
}
