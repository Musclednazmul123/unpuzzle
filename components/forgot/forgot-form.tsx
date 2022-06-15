import { Formik, Field, Form, FormikHelpers } from 'formik';
import * as React from "react";
 import toast from "../Toast";
import styles from './forgot-form.module.css'
import {json} from "stream/consumers";

interface Values {
  email: string;
}

export default function ForgotForm() {
    const notify = React.useCallback((type, message) => {
        toast({ type, message });
    }, []);

    const dismiss = React.useCallback(() => {
        toast.dismiss();
    }, []);

    return (

      <div className={styles.register_box + ' p-3'}>
        <h1 className="display-6 mb-3">Forgot Password</h1>
        <Formik
          initialValues={{
            email:''
          }}

          onSubmit={(
            values: Values,
            { setSubmitting }: FormikHelpers<Values>,
          ) => {


              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

              var urlencoded = new URLSearchParams();
              urlencoded.append("email", ''+values.email);
              var requestOptions = {
                  method: 'POST',
                  headers: myHeaders,
                  body: urlencoded,
                  redirect: 'follow'
              };

              fetch("http://13.233.22.187:3000/v1/auth/forgot-password", requestOptions)
                  .then(response => response.text())
                  .then(result =>{
                      const resultJson = JSON.parse(result)
                      localStorage.setItem("tokens_forgot",JSON.stringify(resultJson.token));
                      if(resultJson.hasOwnProperty("code"))
                      {
                          notify("error", resultJson.message)
                      }else{
                          notify("success", resultJson.message)
                          setTimeout(()=>{
                              location.href = '/passwordreset'
                          },500);
                      }

                  })
                  .catch(error => console.log('error', error));
          }}

        >
          <Form>

            <div className="mb-3">
              <Field className="form-control" required type="email" id="email" name="email" placeholder="Please enter the email" aria-describedby="emailHelp" />
            </div>
  


            <button type="submit" className="btn btn-primary">Forgot Password</button>
              <button type="reset"  className={'btn btn-default '+styles.button_default}>Reset</button>
          </Form>
        </Formik>
      </div>
    );
  };