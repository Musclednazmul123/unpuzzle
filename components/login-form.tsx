import { Formik, Field, Form, FormikHelpers } from 'formik';
import styles from './login-form.module.css'
import React, { Component } from 'react';
import toast from "./Toast";
import GoogleLoginForm from './google-login-form'
import Link from 'next/link'

interface Values {
    username: string;
    password: string;
}


export default class Home extends Component {

    componentDidMount() {
        var tokens = localStorage.getItem("tokens")||null;
        if(tokens!==''){
            if(tokens && tokens !== 'undefined'){
                if(tokens && tokens !==''){
                    tokens = tokens||'';
                    if(tokens !==''){
                        location.href = 'dashboard'
                    }
                }
            }
        }
    }
    notify = ((type:any, message:any) => {
        toast({ type, message });
    });
    render() {

        return (

            <div className={styles.login_box + ' p-3'}>

                <h1 className="display-6 mb-3">Login</h1>
                <Formik
                    initialValues={{
                        username: '',
                        password: ''
                    }}

                    onSubmit={(
                        values: Values,
                        { setSubmitting }: FormikHelpers<Values>
                    ) => {


                        var myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                        var urlencoded = new URLSearchParams();
                        urlencoded.append("loginType", "2");
                        urlencoded.append("email", ""+values.username);
                        urlencoded.append("password", ""+values.password);

                        fetch("http://13.233.22.187:3000/v1/auth/login", {
                            method: 'POST',
                            headers: myHeaders,
                            body: urlencoded,
                            redirect: 'follow'
                        })
                            .then(response => response.text())
                            .then(result => {
                                const resultJson = JSON.parse(result)
                                if (resultJson.hasOwnProperty("code")) {
                                    this.notify("error", resultJson.message)
                                } else {
                                    this.notify("success", resultJson.message)
                                    localStorage.setItem("tokens", JSON.stringify(resultJson.data.tokens.access.token));
                                    localStorage.setItem("tokens_user", JSON.stringify(resultJson.data.user));
                                    setTimeout(() => {
                                        location.href = '/dashboard'
                                    }, 1000);
                                }

                            })
                            .catch(error => console.log('error', error));

                    }}

                >
                    <Form>
                        <div className="mb-3">
                            <Field className="form-control" id="username" name="username" placeholder="Username" aria-describedby="usernameHelp" />
                        </div>

                        <div className="mb-3">
                            <Field className="form-control" id="password" name="password" placeholder="Password" type="password" />
                        </div>

                        <button type="submit" className="btn btn-primary">Login</button> &nbsp;
                        <Link href="/signup">
                            <a>Sign Up</a>
                        </Link>
                        <Link href="/forgot" >
                            <a className={styles.ml_1} >Forgot Password</a>
                        </Link>
                    </Form>
                </Formik>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        width: "100%",
                        textAlign: "center",
                    }}
                >
                    <GoogleLoginForm/>
                </div>
            </div>
        );
    }
}