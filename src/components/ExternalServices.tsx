
import React from "react";
import TawkToChat from "./TawkToChat";
import CallButton from "./CallButton";

interface ExternalServicesProps {
  tawkToPropertyId: string;
  tawkToWidgetId: string;
}

const ExternalServices = ({ tawkToPropertyId, tawkToWidgetId }: ExternalServicesProps) => {
  return (
    <>
      <TawkToChat propertyId={tawkToPropertyId} widgetId={tawkToWidgetId} />
      <CallButton />
    </>
  );
};

export default ExternalServices;
