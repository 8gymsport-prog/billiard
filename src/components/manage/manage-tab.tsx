import { PricingSettings } from "./pricing-settings";
import { TableList } from "./table-list";

export function ManageTab() {
  return (
    <div className="p-4 sm:p-6 space-y-6">
      <PricingSettings />
      <TableList />
    </div>
  );
}
