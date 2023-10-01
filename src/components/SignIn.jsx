import { Globals } from "../App";
import UserForm from "./UserForm";
import { toast } from "react-toastify";
import PageHeading from "./PageHeading";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useContext } from "react";

export default function SignIn({ setLoading }) {
  const navigate = useNavigate();
  const globals = useContext(Globals);

  async function isSignedIn() {
    const signer = await globals.getSigner();
    const address = await signer.getAddress();
    const signedIn = await globals.rpcFundraiserContract.userExists(address);

    if (signedIn) navigate(`/user/${address}`);
  }

  useEffect(() => {
    setLoading(true); // true
    isSignedIn()
      .then(() => setLoading(false))
      .catch((err) => {
        setLoading(false);
        toast.error(err.message, { pauseOnHover: false, theme: "colored" });
      });
  }, []);

  return (
    <>
      <PageHeading
        exploreBtn={false}
        addNewBtn={false}
        title={"Register Now"}
      />

      <div className="item-details-page">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-heading">
                <div className="line-dec"></div>
                <h2>
                  Give your <em>details</em> Here.
                </h2>
              </div>
            </div>
            <div className="col-lg-12">
              <UserForm />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
