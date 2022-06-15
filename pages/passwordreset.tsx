import type { NextPage } from 'next'
import Head from 'next/head'
import ResetPasswordForm from '../components/reset/reset-form'

const reset: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Reset Password</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="vh-100 d-flex justify-content-center align-items-center">
        <ResetPasswordForm/>
      </main>
    </div>
  )
}

export default reset
