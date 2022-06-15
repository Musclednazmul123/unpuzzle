
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

    const loadDataOnlyOnce = async(session) => {
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


            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
                redirect: 'follow'
            };

            await fetch("http://13.233.22.187:3000/v1/auth/register", requestOptions)
                .then(response => response.text())
                .then(result => {
                    const resultJson = JSON.parse(result)
                    localStorage.setItem("tokens", JSON.stringify(resultJson));
                    if (resultJson.hasOwnProperty("code")) {
                        if (resultJson.code == 400 && resultJson.message === 'Email already taken') {


                            var urlencoded = new URLSearchParams();
                            urlencoded.append("loginType", "1");
                            urlencoded.append("email", session.user.email || '');
                            urlencoded.append("socialId", session.user.email || '');
                            urlencoded.append("idToken", session.user.email || '');

                            var requestOptions = {
                                method: 'POST',
                                headers: myHeaders,
                                body: urlencoded,
                                redirect: 'follow'
                            };

                            fetch("http://13.233.22.187:3000/v1/auth/login", requestOptions)
                                .then(response => response.text())
                                .then(result => {
                                    const resultJson2 = JSON.parse(result)
                                    notify("error", resultJson2.message)
                                    console.log('result', result)
                                })
                                .catch(error => console.log('error', error));
                        }

                    } else {
                        notify("success", "Register Successfully !")
                        setTimeout(() => {
                            location.href = '/dashboard'
                        }, 100);
                    }

                })
                .catch(error => console.log('error', error));


        }

        };

    useEffect(() => {
        console.log('session',session)
        loadDataOnlyOnce(session); // this will fire only on first render
    });

    return (

        <div>

            {!session && (
                <>
                <button onClick={() => signIn("google")}>Sign in with Google</button>
                </>
            )}

            {session && (
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
