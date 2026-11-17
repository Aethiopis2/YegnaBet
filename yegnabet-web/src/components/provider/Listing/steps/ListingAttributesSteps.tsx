import {
  useEffect,
  useState,
} from "react";

import type { ListingAttributeValue } from "../../../../types/provider/providerTypes";
import type { TNodeAttributeDefinition } from "../../../../types/provider/attributeDefinition";
import Loading from "../../../ui/common/Loading";
import { ListingTextField } from "../fields/ListingTextField";
import { ListingIntegerField } from "../../common/ListingIntegerField";
import { ListingDecimalField } from "../../common/ListingDecimalField";
import { ListingBooleanField } from "../../common/ListingBooleanField";
import { ListingDateField } from "../../common/ListingDateField";
import { ListingDateTimeField } from "../../common/ListingDateTimeField";
import { ListingChoiceField } from "../../common/ListingChoiceField";
import { ListingMultiChoiceField } from "../../common/ListingMultiChoiceField";
import { getEmpTaxonomyNodeAttributes } from "../../../../lib/employee/employeServices";
import ErrorBlock from "../../../ui/common/ErrorBlock";


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
  token: string;
}

export function ListingAttributesStep({
  nodeId,
  attributes,
  onChange,
  token,
}: Props) {
  const [nodeAttributes, setNodeAttributes] = useState<TNodeAttributeDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {

    const fetchNodeAttributes = async () => {
      setLoading(true);
      try {
        const response = await getEmpTaxonomyNodeAttributes(token, nodeId);
        setNodeAttributes(response);
      } catch (err) {
        console.error("Failed to fetch node attributes", err);
        setError("Failed to fetch node attributes" + String(err));
        setNodeAttributes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNodeAttributes();
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

  if (loading) return <Loading />;

  if (error) return <ErrorBlock message={error} />;

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
                  label={attribute.label}
                  hint={attribute.key}
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