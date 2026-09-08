import type { ListingDraft } from "../../../../types/providerListings";

import { ListingSelect } from "../fields/ListingSelect";
import { ListingTextField } from "../fields/ListingTextField";

interface Props {
value: ListingDraft;

onChange: (
changes: Partial<ListingDraft>
) => void;
}

export function ListingDetailsStep({
value,
onChange,
}: Props) {
return ( <div className="space-y-7"> <div> <h2 className="text-xl font-bold text-slate-900 dark:text-white">
Listing information </h2>

    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
      Set your price and how you want the listing to be offered.
    </p>
  </div>

  <div className="grid gap-5 sm:grid-cols-2">
    <ListingTextField
      label="Price"
      type="number"
      min="0"
      placeholder="0"
      value={value.price}
      onChange={(event) =>
        onChange({
          price: event.target.value,
        })
      }
    />

    <ListingSelect
      label="Price unit"
      value={value.priceUnit}
      onChange={(event) =>
        onChange({
          priceUnit:
            event.target.value,
        })
      }
    >
      <option value="">
        Select unit
      </option>

      <option value="total">
        Total price
      </option>

      <option value="monthly">
        Per month
      </option>

      <option value="daily">
        Per day
      </option>

      <option value="hourly">
        Per hour
      </option>
    </ListingSelect>

    <ListingSelect
      label="Listing method"
      value={value.method}
      onChange={(event) =>
        onChange({
          method:
            event.target.value,
        })
      }
    >
      <option value="">
        Select method
      </option>

      <option value="buy">
        For sale
      </option>

      <option value="rent">
        For rent
      </option>

      <option value="contract">
        Contract
      </option>

      <option value="service">
        Service
      </option>
    </ListingSelect>
  </div>
</div>

);
}
