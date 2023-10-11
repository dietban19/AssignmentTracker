import React from "react";
import { useUserContext } from "../../context/userContext";
const profile = () => {
  const { user } = useUserContext();
  return (
    <div>
      profile
      <span>{user && user.email}</span>
    </div>
  );
};

export default profile;
