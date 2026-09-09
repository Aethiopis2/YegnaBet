import {
  useEffect,
  useState,
} from "react";

import { API } from "../../../../types/api";
import type { ListingAttributeValue } from "../../../../types/providerListings";
import type { TNodeAttributeDefinition } from "../../../../types/provider/attributeDefinition";
import Loading from "../../../ui/Loading";
import { ListingTextField } from "../fields/ListingTextField";
import { ListingIntegerField } from "../../common/ListingIntegerField";
import { ListingDecimalField } from "../../common/ListingDecimalField";
import { ListingBooleanField } from "../../common/ListingBooleanField";
import { ListingDateField } from "../../common/ListingDateField";
import { ListingDateTimeField } from "../../common/ListingDateTimeField";
import { ListingChoiceField } from "../../common/ListingChoiceField";
import { ListingMultiChoiceField } from "../../common/ListingMultiChoiceField";


interface Props {
  nodeId: number;
  attributes: Record<
    string,
    ListingAttributeValue
  >;
  onChange: (
    attributes: Record<
      string,
      ListingAttributeValue
    >
  ) => void;
}

export function ListingAttributesStep({
  nodeId,
  attributes,
  onChange,
}: Props) {
  const [nodeAttributes, setNodeAttributes] =
    useState<TNodeAttributeDefinition[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    setLoading(true);

    API.get(
      `/provider/get-taxonomyNodeAtrributes?nodeId=${nodeId}`
    )
      .then((r) => {
        setNodeAttributes(r.data);
      })
      .catch((error) => {
        console.error(
          "Failed to load listing attributes",
          error
        );

        setNodeAttributes([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [nodeId]);

  const update = (
    key: string,
    value: ListingAttributeValue
  ) => {
    onChange({
      ...attributes,
      [key]: value,
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-7">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Tell us more
        </h2>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Add details that help customers understand your listing.
        </p>
      </div>

      <div className="space-y-3">
        {nodeAttributes.map((attribute) => {
          const value =
            attributes[attribute.key];

          const props = {
            attribute,
            value,
            onChange: (
              newValue: ListingAttributeValue
            ) =>
              update(
                attribute.key,
                newValue
              ),
          };

          switch (attribute.type) {
            case "Text":
              return (
                <ListingTextField
                  key={attribute.id}
                  {...props}
                />
              );

            case "Integer":
              return (
                <ListingIntegerField
                  key={attribute.id}
                  {...props}
                />
              );

            case "Decimal":
              return (
                <ListingDecimalField
                  key={attribute.id}
                  {...props}
                />
              );

            case "Boolean":
              return (
                <ListingBooleanField
                  key={attribute.id}
                  {...props}
                />
              );

            case "Date":
              return (
                <ListingDateField
                  key={attribute.id}
                  {...props}
                />
              );

            case "DateTime":
              return (
                <ListingDateTimeField
                  key={attribute.id}
                  {...props}
                />
              );

            case "Choice":
              return (
                <ListingChoiceField
                  key={attribute.id}
                  {...props}
                />
              );

            case "MultiChoice":
              return (
                <ListingMultiChoiceField
                  key={attribute.id}
                  {...props}
                />
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  );
}