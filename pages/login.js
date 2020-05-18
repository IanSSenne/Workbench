import React from "react";
import { Wrap } from "../components/wrap";
import LoginContainer from "../components/auth/LoginContainer";

function Page() {
  return (
    <>
      <LoginContainer></LoginContainer>
    </>
  );
}
export default () => <Wrap><Page></Page></Wrap>
