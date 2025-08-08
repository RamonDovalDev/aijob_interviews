import Agent from "@/components/Agent";
import React from "react";

const InterviewPage = () => {
  return (
    <>
      <h3>Interview Generation</h3>

      <Agent userName="Ramón" userId="user1" type="generate" />
    </>
  );
};

export default InterviewPage;
