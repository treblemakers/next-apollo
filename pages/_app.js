// import App from 'next/app'

import { ApolloProvider } from "@apollo/react-hooks"
import fetch from "isomorphic-unfetch"
import cookie from "cookie"

import PageLayout from "../components/PageLayout";
import AuthProvider from "../appState/AuthProvider";
import apolloClient from "../apollo/apolloClient"

const QUERY_USER = {
  query: `
    query {
      user {
        id
        name
        email
        products {
          id
        }
        carts {
          id
          product {
            description
            imageUrl
            price
          }
          quantity
        }
      }
    }
  `
}

function MyApp({ Component, pageProps, apollo, user }) {
  // console.log("User : ",user)
  return (
    <ApolloProvider client={apollo}>
      <AuthProvider userData={user}>
      <PageLayout>
        <Component {...pageProps} />
      </PageLayout>
      </AuthProvider>
    </ApolloProvider>
  )
}

// function MyApp({ Component, pageProps, apollo }) {
//   return (
//     <AuthProvider>
//       <PageLayout>
//         <Component {...pageProps} />
//       </PageLayout>
//     </AuthProvider>
//   );
// }

// Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
MyApp.getInitialProps = async ({ctx, router}) => {
  if (process.browser) {
    return __NEXT_DATA__.props.pageProps
  }

  // console.log(ctx.req.headers)
  // console.log("Router : ",router)
  const { headers } = ctx.req

  const cookies = headers && cookie.parse(headers.cookie || "")

  const token = cookies && cookies.jwt
  // console.log(token)

  // Route Protection
  if (!token) {
    if (router.pathname === "/cart") {
      ctx.res.writeHead(302, { Location: "/signin" })
      ctx.res.end()
    }
    if (router.pathname === "/manageProduct") {
      ctx.res.writeHead(302, { Location: "/signin" })
      ctx.res.end()
    }
    return null
  }

  const response = await fetch("http://localhost:9000/graphql", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}` || ""
    },
    body: JSON.stringify(QUERY_USER)
  })

  if (response.ok) {
    const result = await response.json()
    // console.log(result)
    return { user: result.data.user }
  } else {
    // Route Protection
    if (router.pathname === "/cart") {
      ctx.res.writeHead(302, { Location: "/signin" })
      ctx.res.end()
    }
    if (router.pathname === "/manageProduct") {
      ctx.res.writeHead(302, { Location: "/signin" })
      ctx.res.end()
    }
    return null
  }
  // calls page's `getInitialProps` and fills `appProps.pageProps`
 
}

export default apolloClient(MyApp);
