import type { NextPage } from 'next'
import Head from 'next/head'
import Dashboard from '../components/dashboard/dashboard-form'

const dashboard: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Dashboard Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
      <main className="vh-100 d-flex justify-content-center align-items-center">
          {/*<Dashboard/>*/}
      </main>
    </div>
  )
}

export default dashboard
