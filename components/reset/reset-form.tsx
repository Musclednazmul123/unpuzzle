import { Formik, Field, Form, FormikHelpers } from 'formik';
// import * as React from "react";
import React, { Component } from 'react';
 import toast from "../Toast";
import styles from './reset-form.module.css'


interface Values {
    password: string;
}



// export default function ResetForm() {
export default class ResetForm extends Component {

    componentDidMount() {
        this.callInitSetUp();
    }
    callInitSetUp = () => {
        const tokensMain = localStorage.getItem("tokens_forgot")||null;
        if(tokensMain!=='' || typeof tokensMain !== 'undefined'){
            if(tokensMain){
                this.notify("success", "Please enter the new password then submit")
            } else {
                this.notify("error", 'reset token not found')
                setTimeout(()=>{
                    location.href = '/forgot'
                },500);
            }
        } else {
            this.notify("error", 'reset token not found')
            setTimeout(()=>{
                location.href = '/forgot'
            },500);
        }
    }
    notify = ((type, message) => {
        toast({ type, message });
    });

    render() {
        return (

            <div className={styles.register_box + ' p-3'}>
                <h1 className="display-6 mb-3">Reset Password</h1>
                <Formik
                    initialValues={{
                        password: ''
                    }}

                    onSubmit={(values: Values,
                               {setSubmitting}: FormikHelpers<Values>,) => {

                        const tokens = localStorage.getItem("tokens_forgot")||null;
                        let myHeaders = new Headers();
                        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                        let urlencoded = new URLSearchParams();
                        urlencoded.append("password", ''+ values.password);
                        let requestOptions = {
                            method: 'POST',
                            headers: myHeaders,
                            body: urlencoded,
                            redirect: 'follow'
                        };

                        let url ='http://13.233.22.187:3000/v1/auth/reset-password?token='+tokens.replace(/"/g, '');
                        fetch(url, requestOptions)
                            .then(response => response.text())
                            .then(result => {
                                const resultJson = JSON.parse(result)
                                localStorage.setItem("tokens_forgot", JSON.stringify(resultJson.token));
                                if (resultJson.hasOwnProperty("code")) {
                                    this.notify("error", resultJson.message)
                                    setTimeout(() => {
                                        location.href = '/forgot'
                                    }, 500);
                                } else {
                                    this.notify("success", resultJson.message)
                                    localStorage.removeItem("tokens_forgot");
                                    setTimeout(() => {
                                        location.href = '/'
                                    }, 800);
                                }

                            })
                            .catch(error => console.log('error', error));
                    }}

                >
                    <Form>

                        <div className="mb-3">
                            <Field className="form-control" required type="password" id="password" name="password"
                                   placeholder="Please enter the password" title ="password must be at least 8 characters" aria-describedby="passwordHelp"/>
                        </div>
                        <button type="submit" className="btn btn-primary">Reset Password</button>
                        <button type="reset" className={'btn btn-default ' + styles.button_default}>Reset</button>
                    </Form>
                </Formik>
            </div>
        );
    }
  };