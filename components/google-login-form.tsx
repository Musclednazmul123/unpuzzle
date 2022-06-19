
import { signIn, signOut, useSession } from 'next-auth/client';
import axios from 'axios';
import toast from "./Toast";
import React, { useState, useEffect } from 'react';


export default function Home() {
    const [session, loadingSession] = useSession();
    const [loading, setLoading] = useState(false);
    const [subsList, setSubsList] = useState([]);
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);
    let checked = true;

    const loadDataOnlyOnce = async(session:any) => {
        console.log("loadDataOnlyOnce");
        if(session && session.user) {

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("loginType", "1");
            urlencoded.append("firstName", session.user.name || '');
            urlencoded.append("lastName", session.user.name || '');
            urlencoded.append("username", session.user.email || '');
            urlencoded.append("email", session.user.email || '');
            urlencoded.append("socialId", session.user.email || '');
            urlencoded.append("idToken", session.user.email || '');

            await fetch("http://13.233.22.187:3000/v1/auth/register", {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            })
                .then(response => response.text())
                .then(result => {
                    const resultJson = JSON.parse(result)
                    if (resultJson.hasOwnProperty("code")) {
                        if (resultJson.code == 400 && resultJson.message === 'Email already taken') {


                            let urlencoded = new URLSearchParams();
                            urlencoded.append("loginType", "1");
                            urlencoded.append("email", session.user.email || '');
                            urlencoded.append("socialId", session.user.email || '');
                            urlencoded.append("idToken", session.user.email || '');


                            fetch("http://13.233.22.187:3000/v1/auth/login", {
                                method: 'POST',
                                headers: myHeaders,
                                body: urlencoded,
                                redirect: 'follow'
                            })
                                .then(response => response.text())
                                .then(result => {
                                    const resultJsonGlogin = JSON.parse(result)
                                    if (resultJsonGlogin.hasOwnProperty("code")) {
                                        notify("error", resultJsonGlogin.message)
                                    } else {
                                        notify("success", resultJsonGlogin.message)
                                        localStorage.setItem("tokens", JSON.stringify(resultJsonGlogin.data.tokens.access.token));
                                        localStorage.setItem("tokens_user", JSON.stringify(resultJsonGlogin.data.user));
                                        setTimeout(() => {
                                            location.href = '/dashboard'
                                        }, 1000);
                                    }
                                })
                                .catch(error => console.log('error', error));
                        }

                    } else {
                        if(resultJson.hasOwnProperty("code"))
                        {
                            notify("error", resultJson.message)
                        }else{
                            notify("success", "Register Successfully !")
                            localStorage.setItem("tokens",JSON.stringify(resultJson.data.tokens.access.token));
                            localStorage.setItem("tokens_user", JSON.stringify(resultJson.data.user));
                            setTimeout(()=>{
                                location.href = '/dashboard'
                            },100);
                        }
                    }
                })
                .catch(error => console.log('error', error));
        }
    };

    useEffect(async () => {
        // console.log('session',session)
        let sessionVar = await session;
            // console.log('session',sessionVar)
            // console.log('checked',checked)
            if(typeof sessionVar != 'undefined' && checked) {
                checked = false;
                loadDataOnlyOnce(sessionVar); // this will fire only on first render
            }

    });

    return (

        <div>

            {!session && (
                <>
                <button onClick={() => signIn("google")}>Sign in with Google</button>
                </>
            )}

            {session &&false&& (
                <>
                <button onClick={() => signOut()}>Sign Out</button>
                {/*<p>
                    <pre>{JSON.stringify(session, null, 2)}</pre>
                </p>*/}
                </>
            )}
        </div>
    );
}
