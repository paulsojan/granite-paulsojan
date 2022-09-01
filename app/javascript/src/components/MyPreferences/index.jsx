import React, { useState, useEffect } from "react";

import preferencesApi from "apis/preferences";
import Container from "components/Container";
import PageLoader from "components/PageLoader";
import { getFromLocalStorage } from "utils/storage";

import Form from "./Form";

const MyPreferences = () => {
  const [notificationDeliveryHour, setNotificationDeliveryHour] = useState("");
  const [shouldReceiveEmail, setShouldReceiveEmail] = useState(true);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [preferenceId, setPreferenceId] = useState("");
  const userId = getFromLocalStorage("authUserId");

  const updatePreference = async () => {
    setLoading(true);
    try {
      await preferencesApi.update({
        payload: {
          notification_delivery_hour: notificationDeliveryHour,
          receive_email: shouldReceiveEmail,
        },
      });
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const updateEmailNotification = async emailNotificationStatus => {
    setLoading(true);
    try {
      await preferencesApi.mail({
        id: preferenceId,
        payload: {
          receive_email: emailNotificationStatus,
        },
      });
    } catch (error) {
      logger.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferenceDetails = async () => {
    try {
      const { data } = await preferencesApi.show();
      setNotificationDeliveryHour(data.preference.notification_delivery_hour);
      setShouldReceiveEmail(data.preference.receive_email);
      setPreferenceId(data.preference.id);
    } catch (error) {
      logger.error(error);
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    fetchPreferenceDetails();
  }, []);

  if (pageLoading || !userId || !preferenceId) {
    return (
      <div className="h-screen w-screen">
        <PageLoader />
      </div>
    );
  }

  return (
    <Container>
      <Form
        loading={loading}
        notificationDeliveryHour={notificationDeliveryHour}
        setNotificationDeliveryHour={setNotificationDeliveryHour}
        setShouldReceiveEmail={setShouldReceiveEmail}
        shouldReceiveEmail={shouldReceiveEmail}
        updateEmailNotification={updateEmailNotification}
        updatePreference={updatePreference}
      />
    </Container>
  );
};

export default MyPreferences;
