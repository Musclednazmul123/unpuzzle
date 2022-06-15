import 'bootstrap/dist/css/bootstrap.css'
import '../styles/globals.css'
import type { AppProps } from 'next/app'
import * as React from "react";
import { ToastContainer } from "react-toastify";
import toast from "../components/Toast";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }: AppProps) {
    /*React.useEffect(() => {
        toast({ type: "info", message: "Hello world!" });
    }, []);*/
  // return <Component {...pageProps} />
    return (
        <>
        <Component {...pageProps} />
        <ToastContainer
            position="top-right"
            autoClose={8000}
            hideProgressBar={false}
            newestOnTop={false}
            draggable={false}
            pauseOnVisibilityChange
            closeOnClick
            pauseOnHover
        />
        </>
    );
}
export default MyApp
