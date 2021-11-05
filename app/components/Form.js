import React from "react";
import { Formik } from "formik";

function AppForm({ initialValues, onSubmit, children }) {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {() => <>{children}</>}
    </Formik>
  );
}

export default AppForm;
