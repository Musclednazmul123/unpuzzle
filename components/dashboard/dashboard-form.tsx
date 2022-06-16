import { Formik, Field, Form, FormikHelpers } from 'formik';
import React, { Component } from 'react';
import styles from './dashboard-form.module.css'
import toast from "../Toast";
import { signIn, signOut, useSession } from 'next-auth/client';

// interface Values {

// }

/*export default function DashbordForm() {
  
  const callUserAPI = async () => {
    try {
      const res = await fetch(`http://13.233.22.187:3000/v1/users/`,{
        credentials: 'include',
        mode: 'cors',
        headers: {
          // 'Content-Type': 'application/json',
          'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExLCJpYXQiOjE2NTQxODA0NzcsImV4cCI6MTY1NDE4MTM3NywidHlwZSI6ImFjY2VzcyJ9.NHvWUdP3-I4L4_xlBfRMJlpP7EYJUyKDvwTqCCbWLxU",
        },
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  const callProfileAPI = async () => {
    try {
      const res = await fetch(`http://13.233.22.187:3000/v1/users/profile`,{
        credentials: 'include',
        headers: {
          // 'Content-Type': 'application/json',
          'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjExLCJpYXQiOjE2NTQxODA0NzcsImV4cCI6MTY1NDE4MTM3NywidHlwZSI6ImFjY2VzcyJ9.NHvWUdP3-I4L4_xlBfRMJlpP7EYJUyKDvwTqCCbWLxU",
        },
      });
      const data = await res.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
    return (
      <div className={styles.dashboard_box + ' p-3'}>
        <div align="left">Hello User,</div>
        <div align="right" className={styles.mt_30}>
            <button  onClick={callUserAPI}>Get the latest Users List</button>
          </div>
        <h1 className="display-6 mb-3">Dashboard</h1>
        <Formik
          initialValues={{
            // data :callUserAPI(),
            // profile:callProfileAPI()  
          }}

          onSubmit={(
            values: Values,
            { setSubmitting }: FormikHelpers<Values>
          ) => {
            
            
          }}

        >
          <Form>
         
          </Form>
        </Formik>
      </div>
    );
  };*/


export default class dashboard extends Component {

   /* constructor() {
         //super(props);

    }*/
    componentWillMount() {
        // console.log('hi will')
        this.state={};
    }
    componentDidMount() {
       // this.state={};
        this.callInitSetUp();

    }

    callInitSetUp = () => {
        let tokensMain = localStorage.getItem("tokens")||{};
        if(tokensMain!=='' && tokensMain !== 'undefined' && typeof tokensMain === 'string'){
            tokensMain = JSON.parse(tokensMain);
            if(tokensMain && typeof tokensMain !== 'undefined' && tokensMain.hasOwnProperty("data") && tokensMain!=null){
                const tokens = tokensMain.data.tokens.access.token ||''
                this.setState({...tokensMain.data.user});
                if(tokens !==''){
                    let role = tokensMain.data.user.role;
                    if(role === 'admin'){
                        this.callUserAPI(tokens);
                    }else{
                        const dataUserList = [tokensMain.data.user]
                        this.setState({dataUserList});
                    }
                };
            } else {
                location.href = '/'
            }
        } else {
            location.href = '/'
        }
    }
    callUserAPI = async (tokens) => {
        try {
            const res = await fetch(`http://13.233.22.187:3000/v1/users/`,{
                credentials: 'include',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer "+tokens,
                },
            });
            if(res.status === 401){
                localStorage.clear();
                location.href = '/'
            }else {
                const dataUserList = await res.json();
                this.setState({dataUserList});
            }

        } catch (err) {
            console.log(err);
        }
    };
    notify = ((type, message) => {
        toast({ type, message });
    });

    getAccessToken = () =>{
        let tokensMain = localStorage.getItem("tokens")||null;
        let tokens = '';
        if(tokensMain!=='' && tokensMain !== 'undefined'){
            tokensMain = JSON.parse(tokensMain);
            if(tokensMain && typeof tokensMain !== 'undefined' ){
                tokens = tokensMain.data.tokens.access.token;
            }
        }
        return {tokens,tokensMain};
    }
    emailVerified = () => {
        try {
            let tokens = this.getAccessToken().tokens;
            let tokensMain = this.getAccessToken().tokensMain;

            let myHeaders = new Headers();
            myHeaders.append("Authorization", "Bearer "+tokens);

            let requestOptions = {
                method: 'GET',
                headers: myHeaders,
                redirect: 'follow'
            };

            fetch("http://13.233.22.187:3000/v1/auth/send-verification-email", requestOptions)
                .then(response => response.text())
                .then(result =>{
                    const resultJson = JSON.parse(result)
                    if(resultJson.hasOwnProperty("code"))
                    {
                        this.notify("error", resultJson.message)
                    }else{
                        //this.notify("success", resultJson.message)
                        const VerifyEmailToken = resultJson.token.replace(/"/g, '');
                        let requestOptionsV = {
                            method: 'GET',
                            redirect: 'follow'
                        };

                        fetch("http://13.233.22.187:3000/v1/auth/verify-email?token="+VerifyEmailToken, requestOptionsV)
                            .then(response => response.text())
                            .then(result =>{
                                const resultJsonV = JSON.parse(result)
                                //console.log(resultJsonV);
                                this.notify("success", resultJsonV.message)

                                this.reloadProfile(myHeaders,tokensMain);


                            })
                            .catch(error => console.log('error', error));


                    }

                })
                .catch(error => console.log('error', error));

        } catch (err) {
            console.log(err);
        }
    }
    reloadProfile = (myHeaders,tokensMain) =>{
        var requestOptionsP = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };
        fetch("http://13.233.22.187:3000/v1/users/profile", requestOptionsP)
            .then(response => response.text())
            .then(result => {
                const resultJsonP = JSON.parse(result)

                tokensMain.data.user = resultJsonP.data;

                localStorage.setItem("tokens", JSON.stringify(tokensMain));
                setTimeout(() => {
                    location.href = '/dashboard'
                }, 1000);
            })
            .catch(error => console.log('error', error));
    }
    logout = () => {
        try {
             signOut();
            setTimeout(()=>{
                localStorage.clear();
                location.href = '/'
            },1000)


        } catch (err) {
            console.log(err);
        }
    };

    refresh = () => {
        this.callInitSetUp();
    }
    render(){
        const {firstName='',lastName='',role='',dataUserList =[] } = this.state;
        let roleName =role.charAt(0).toUpperCase() + role.slice(1);;
        return (
            <div className={styles.dashboard_box + ' p-3'}>
                {
                    <div align="left" >Hello {firstName??'' } {lastName??''},</div>}
                    <div align="right" > <a href="#" onClick={this.logout } >logout </a> </div>

                <h1 className="display-6 mb-3">{roleName} Dashboard</h1>
                <Formik
                    initialValues={{
                        // data :callUserAPI(),
                        // profile:callProfileAPI()
                    }}

                    onSubmit={(
                        values: Values,
                        { setSubmitting }: FormikHelpers<Values>
                    ) => {

                        let tokens = this.getAccessToken().tokens;
                        let tokensMain = this.getAccessToken().tokensMain;

                        if(values && values.loginType!='') {

                            let myHeaders = new Headers();
                            myHeaders.append("Authorization", "Bearer "+tokens);
                            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

                            let urlencoded = new URLSearchParams();
                            urlencoded.append("role", values.loginType);

                            let requestOptions = {
                                method: 'POST',
                                headers: myHeaders,
                                body: urlencoded,
                                redirect: 'follow'
                            };

                            fetch("http://13.233.22.187:3000/v1/users/change-role", requestOptions)
                                .then(response => response.text())
                                .then(result => {
                                    const resultJsonRole = JSON.parse(result)
                                    if (resultJsonRole.hasOwnProperty("code")) {
                                        this.notify("error", resultJsonRole.message)
                                    } else {
                                        this.notify("success", resultJsonRole.message)
                                        this.reloadProfile(myHeaders, tokensMain);
                                    }
                                })
                                .catch(error => console.log('error', error));
                        }else{
                            this.notify("error", 'Please select role')
                        }

                    }}

                >
                    <Form>
                        <span>Your Current Roles:- <strong>{roleName}</strong></span>
                        <div className="mb-3"> Roles &nbsp;
                            <label>
                                <Field type="radio" name="loginType"  value="admin" />  Admin</label> &nbsp;
                            <label>
                                <Field type="radio" name="loginType"   value="student" />  Student </label>&nbsp;
                            <label >
                                <Field type="radio" name="loginType"  value="tutor" /> Tutor </label> &nbsp;

                        <button type="submit" className="btn btn-primary">Changes</button>
                        </div>
                    </Form>
                </Formik>
                <div className="container">
                    <h4>{roleName==='Admin'?'All User List':' Profiles'} </h4>
                    <div className ={styles.pull_right}>
                        <button type="button"  className={styles.btn_default + 'btn btn-default'} onClick={this.refresh}>Refresh</button>
                    </div>
                    <table className="table" >
                        <thead>
                        <tr>
                            <th>Firstname</th>
                            <th>Lastname</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Email Verified</th>
                            <th>Role</th>
                            {/*<th style={ roleName==='Admin' ? { display:'block'} : {display : 'none'} }  >Action</th>*/}
                        </tr>
                        </thead>
                        <tbody>

                        {dataUserList.map(( listValue, index ) => {
                             return (
                                <tr>
                                    <td>{listValue.firstName}</td>
                                    <td>{listValue.lastName}</td>
                                    <td>{listValue.username}</td>
                                    <td>{listValue.email}</td>
                                    <td>
                                        {listValue.isEmailVerified?'Yes':'No'}

                                        {
                                            ( roleName != 'Admin' && !listValue.isEmailVerified ) ?
                                            (<span className={styles.ml_1}>
                                                <button type="button" onClick={this.emailVerified}
                                                        title={'click to verify'}>Verify</button>
                                                </span>)
                                            : ''
                                        }

                                    </td>
                                    <td>{listValue.role}</td>
                                    {/*<td style={ roleName==='Admin' ? { display:'block'} : {display : 'none'} }  >{listValue.id}</td>*/}
                                </tr>
                            );
                        })}

                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
