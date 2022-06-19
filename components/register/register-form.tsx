import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as React from "react";
 import toast from "../Toast";
import styles from './register-form.module.css'
import {json} from "stream/consumers";

interface Values {
  loginType: string;
  firstName: string;
  lastName: string;
  email: string;
    username: string;
    password: string;
}

export default function LoginForm() {
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);

    const dismiss = React.useCallback(() => {
        toast.dismiss();
    }, []);

    return (

      <div className={styles.register_box + ' p-3'}>
        <h1 className="display-6 mb-3">Sign Up</h1>
        <Formik
          initialValues={{
            loginType: '2',
            firstName: '',
            lastName:'',
            username: '',
            password: '',
            email:''
          }}

          onSubmit={(
            values: Values,
            { setSubmitting }: FormikHelpers<Values>
          ) => {

           /* if(values.loginType==''){
                notify("error", `Please select type`)
                return false;
            }*/



              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

              var urlencoded = new URLSearchParams();
              urlencoded.append("loginType", values.loginType);
              urlencoded.append("firstName", values.firstName);
              urlencoded.append("lastName", values.lastName);
              urlencoded.append("username", values.username);
              urlencoded.append("email", values.email);
              urlencoded.append("password", ""+values.password);

              var requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: urlencoded,
                  redirect: 'follow'
              };

              fetch("http://13.233.22.187:3000/v1/auth/register", requestOptions)
                  .then(response => response.text())
                  .then(result =>{
                      const resultJson = JSON.parse(result)
                      localStorage.setItem("tokens_user", JSON.stringify(resultJson.data.user));
                      localStorage.setItem("tokens",JSON.stringify(resultJson.data.tokens.access.token));
                      if(resultJson.hasOwnProperty("code"))
                      {
                          notify("error", resultJson.message)
                      }else{
                          notify("success", "Register Successfully !")
                          setTimeout(()=>{
                              location.href = '/dashboard'
                          },100);
                      }

                  })
                  .catch(error => console.log('error', error));
          }}

        >
          <Form>

            <div className="mb-3">
              <Field className="form-control" required id="firstName" name="firstName" placeholder="firstName" aria-describedby="firstNameHelp" />
            </div>
            <div className="mb-3">
              <Field className="form-control" required id="lastName" name="lastName" placeholder="lastName" aria-describedby="lastNameHelp" />
            </div>
            <div className="mb-3">
              <Field className="form-control"  required id="username" name="username" placeholder="Username" aria-describedby="usernameHelp" />
            </div>

            <div className="mb-3">
              <Field className="form-control" required type="email" id="email" name="email" placeholder="email" aria-describedby="emailHelp" />
            </div>
  
            <div className="mb-3">
              <Field className="form-control" required id="password" name="password" title ="password must be at least 8 characters" placeholder="Password" type="password" />
            </div>

            <button type="submit" className="btn btn-primary">Sign Up</button>
              <button type="reset"  className={'btn btn-default '+styles.button_default}>Reset</button>
              <a href="/" className={styles.ml_1}>Back</a>
          </Form>
        </Formik>
      </div>
    );
  };