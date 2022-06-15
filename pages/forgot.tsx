import type { NextPage } from 'next'
import Head from 'next/head'
import ForgotForm from '../components/forgot/forgot-form'

const forgot: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Forgot Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="vh-100 d-flex justify-content-center align-items-center">
        <ForgotForm/>
      </main>
    </div>
  )
}

export default forgot
