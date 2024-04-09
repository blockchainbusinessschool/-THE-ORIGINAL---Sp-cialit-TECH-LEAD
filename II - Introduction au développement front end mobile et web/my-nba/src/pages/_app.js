import { useEffect, useReducer } from "react";
import Router from "next/router";
import { Web3Modal } from "@/context/Web3Modal";
import { UserContext, UserDispatchContext } from "@/context/userContext";
import userReducer from "@/reducer/userReducer";

export default function App({ Component, pageProps }) {
  const [user, dispatch] = useReducer(userReducer, {
    isConnected: false,
    username: null,
    avatarUrl: null,
  });

  useEffect(() => {
    if (!user.isConnected) Router.push("/login");
  }, [user.isConnected]);

  return (
    <>
      <UserContext.Provider value={user}>
        <UserDispatchContext.Provider value={dispatch}>
          <Web3Modal>
            <Component {...pageProps} />
          </Web3Modal>
        </UserDispatchContext.Provider>
      </UserContext.Provider>
    </>
  );
}
