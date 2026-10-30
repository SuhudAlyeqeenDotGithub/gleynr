import { Building2, Pencil } from "lucide-react";
import type { BillingDetails } from "@/lib/billing-info/types";
import BillingNote from "../shared/billing-note";
import BillingSection from "../shared/billing-section";

type BillingDetailsSectionProps = {
  details: BillingDetails;
  onEdit: () => void;
};

const BillingDetailsSection = ({
  details,
  onEdit,
}: BillingDetailsSectionProps) => {
  const groups: { title: string; rows: [string, string | undefined][] }[] = [
    {
      title: "Organisation",
      rows: [
        ["Company name", details.organisationName],
        ["VAT number", details.vatNumber],
      ],
    },
    {
      title: "Billing contact",
      rows: [
        ["Contact name", details.contactName],
        ["Email", details.email],
        ["Phone", details.phone],
      ],
    },
    {
      title: "Billing address",
      rows: [
        ["Address", details.address],
        ["Town / city", details.city],
        ["Postcode", details.postalCode],
        ["Country", details.country],
      ],
    },
  ];

  return (
    <BillingSection
      id="bi-details-title"
      icon={Building2}
      title="Billing details"
      description="Used on your invoices and billing correspondence."
      action={
        <button className="button secondary" onClick={onEdit}>
          <Pencil size={14} /> Edit billing details
        </button>
      }
    >
      <div className="bi-groups">
        {groups.map((group) => (
          <section key={group.title} className="bi-group">
            <h3>{group.title}</h3>
            <dl>
              {group.rows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd className={value ? undefined : "empty"}>
                    {value || "Not provided"}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
      <BillingNote>
        Changes apply to future invoices. Invoices already issued keep the
        details they were issued with. Billing details are separate from your
        subscription.
      </BillingNote>
    </BillingSection>
  );
};

export default BillingDetailsSection;
