import React from "react";
import M from "materialize-css";
import "materialize-css/dist/css/materialize.min.css";

function Form() {
  return (
    <div>
      <div>
        <form className="col s12">
          <div className="row">
            <div className="input-field col s4">
              <input
                placeholder="Placeholder"
                id="first_name"
                type="text"
                className="validate"
              />
              <label for="first_name">First Name</label>
            </div>
            <div className="input-field col s4">
              <input id="last_name" type="text" className="validate" />
              <label htmlFor="last_name">Last Name</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s8">
              <input
                disabled
                value="I am not editable"
                id="disabled"
                type="text"
                className="validate"
              />
              <label htmlFor="disabled">Disabled</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s8">
              <input id="password" type="password" className="validate" />
              <label htmlFor="password">Password</label>
            </div>
          </div>
          <div className="row">
            <div className="input-field col s8">
              <input id="email" type="email" className="validate" />
              <label htmlFor="email">Email</label>
            </div>
          </div>
          <div className="row">
            <div className="col s8">
              This is an inline input field:
              <div className="input-field inline">
                <input id="email_inline" type="email" className="validate" />
                <label htmlFor="email_inline">Email</label>
                <span
                  className="helper-text"
                  data-error="wrong"
                  data-success="right"
                >
                  Helper text
                </span>
              </div>
            </div>
          </div>
          <button
            class="btn waves-effect waves-light"
            type="submit"
            name="action"
          >
            Submit
            <i class="material-icons right">send</i>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Form;
