import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER } from "../utils/mutations";

import Auth from "../utils/auth";

const Signup = () => {
  const [formState, setFormState] = useState({
    username: "",
    email: "",
    password: "",
    admin: false,
    school: "",
  });
  const [addUser, { error }] = useMutation(ADD_USER);

  // update state based on form input changes
  const handleChange = (event) => {
    const admin = document.getElementById("admin").checked;
    const school = document.getElementById("school")?.value || "";
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
      admin: admin,
      school: school,
    });
  };

  // submit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const { data } = await addUser({
        variables: { ...formState },
      });

      Auth.login(data.addUser.token);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <main className="flex-row justify-center mb-4">
      <div className="col-12 col-md-6">
        <div className="card">
          <h4 className="card-header">Sign Up</h4>
          <div className="card-body">
            <form className="signup-form" onSubmit={handleFormSubmit}>
              <label className="text-center" htmlFor="admin">Check box if administrator? </label>
              <input
                type={`checkbox`}
                name="admin"
                id="admin"
                onChange={handleChange}
                className='checkbox'
              ></input>
              <input
                className="form-input"
                placeholder="Your username"
                name="username"
                type="username"
                id="username"
                value={formState.username}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="Your email"
                name="email"
                type="email"
                id="email"
                value={formState.email}
                onChange={handleChange}
              />
              <input
                className="form-input"
                placeholder="******"
                name="password"
                type="password"
                id="password"
                value={formState.password}
                onChange={handleChange}
              />
              {formState.admin && (
                <>
                  <div className="mb-3 text-center">
                    <label className="mr-2" htmlFor="school">Select your school </label>
                    <select name="school" id="school" onChange={handleChange}>
                      <option value="HTM Elementary">HTM Elementary</option>
                      <option value="Code Academy">Code Academy</option>
                      <option value="Express Middle School">
                        Express Middle School
                      </option>
                      <option value="Performant High">
                        Performant High School
                      </option>
                    </select>
                  </div>
                </>
              )}
              <button className=" btn d-block w-100 no-border-btn btn-primary" type="submit">
                Submit
              </button>
            </form>

            {error && <div>Signup failed</div>}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
