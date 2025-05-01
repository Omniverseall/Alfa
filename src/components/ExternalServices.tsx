
import React from "react";
import TawkToChat from "./TawkToChat";


interface ExternalServicesProps {
  tawkToPropertyId: string;
  tawkToWidgetId: string;
}

const ExternalServices = ({ tawkToPropertyId, tawkToWidgetId }: ExternalServicesProps) => {
  return (
    <>
      <TawkToChat propertyId={tawkToPropertyId} widgetId={tawkToWidgetId} />
    </>
  );
};

export default ExternalServices;
