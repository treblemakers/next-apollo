import React, { useState } from "react";
import Link from "next/link";
import Router from "next/router";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

const SIGN_UP = gql`
  mutation SIGN_UP($name: String!, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

const Signup = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [success, setSuccess] = useState(false);

  const [signup, { loading, error }] = useMutation(SIGN_UP, {
    variables: { ...userInfo },
    onCompleted: data => {
      if (data) {
        setSuccess(true);
        setUserInfo({
          name: "",
          email: "",
          password: ""
        });
      }
    }
  });

  const handleChange = e => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async e => {
    try {
      e.preventDefault();
      await signup();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ margin: "100px" }}>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          margin: "auto",
          width: "30%"
        }}
        onSubmit={handleSubmit}
      >
        <input
          style={{ margin: "5px", height: "30px" }}
          type="text"
          name="name"
          placeholder="Username"
          value={userInfo.name}
          onChange={handleChange}
        />
        <input
          style={{ margin: "5px", height: "30px" }}
          type="email"
          name="email"
          placeholder="Email"
          value={userInfo.email}
          onChange={handleChange}
        />
        <input
          style={{ margin: "5px", height: "30px" }}
          type="password"
          name="password"
          placeholder="Password"
          value={userInfo.password}
          onChange={handleChange}
        />
        <button
          style={{
            margin: "5px",
            padding: "10px",
            background: "teal",
            color: "white",
            border: "none",
            cursor: "pointer",
            fontSize: "18px"
          }}
          type="submit"
          disabled={loading}
        >
          Submit
        </button>
      </form>

      <div style={{ width: "30%", margin: "auto" }}>
        {success && (
          //   Router.push("/signin")
          <p>
            You successfully signed up, please{" "}
            <Link href="/signin">
              <a>sign in</a>
            </Link>
            .
          </p>
        )}

        {error && (
          <p style={{ color: "red" }}>{error.graphQLErrors[0].message}</p>
        )}
      </div>
    </div>
  );
};

export default Signup;
