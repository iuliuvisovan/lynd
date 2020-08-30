import React from "react";
import { Field } from "redux-form";
import Form from "../shared/form/Form";
import renderField from "../shared/form/renderField";
import { usernameValidator, passwordValidator, phoneNumberValidator, countryValidator } from "../../util/validators";
import SubmitButton from "../shared/form/SubmitButton";
import CountryCodes from "./CountryCodes";

class SignupForm extends React.Component {
  state = {
    currentCountry: null,
    phoneNumber: ""
  };

  componentDidMount() {
    this.redirectIfLoggedIn();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    this.redirectIfLoggedIn();
  }

  redirectIfLoggedIn() {
    if (this.props.token) this.props.history.push("/");
  }

  onSubmit = ({ username, password }) => {
    this.props.attemptSignup(username, password);
  };

  sendCode = () => {
    const dialCode = (CountryCodes.find(x => x.code === this.state.currentCountry) || {}).dial_code || "";
    const { phoneNumber } = this.state;

    this.props.requestSendSms(dialCode + phoneNumber);
  };

  render() {
    const { phoneNumber } = this.state;

    const dialCode = (CountryCodes.find(x => x.code === this.state.currentCountry) || {}).dial_code || "";

    return (
      <Form loading={this.props.loading} onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <Field name="username" label="username" type="text" component={renderField} validate={usernameValidator} />
        <Field name="password" label="password" type="password" component={renderField} validate={passwordValidator} />
        <Field name="password2" label="confirm password" type="password" component={renderField} />
        <Field
          name="country"
          label="country"
          type="select"
          component={renderField}
          validate={countryValidator}
          onChange={event => this.setState({ currentCountry: event.target.value })}
        >
          <option value="">select...</option>
          {CountryCodes.map(({ name, dial_code, code }) => (
            <option key={code} value={code}>
              {name} ({dial_code})
            </option>
          ))}
        </Field>
        <div
          style={{
            position: "relative",
            height: 0,
            top: "32px",
            left: "9px",
            zIndex: "110",
            fontSize: "15px",
            color: "#454f5b",
            fontFamily: "Arial"
          }}
        >
          <span>{dialCode}</span>
        </div>
        {dialCode && phoneNumber.length > 8 && (
          <div
            style={{
              position: "relative",
              height: 0,
              top: "26px",
              right: "3px",
              alignSelf: "flex-end",
              zIndex: "110",
              fontSize: "15px",
              color: "#454f5b",
              fontFamily: "Arial"
            }}
          >
            <SubmitButton onClick={this.sendCode} type="button">
              send code
            </SubmitButton>
          </div>
        )}
        <Field
          name="phoneNumber"
          label="phone number"
          type="text"
          component={renderField}
          style={{ paddingLeft: 8 + dialCode.length * 10 + "px" }}
          validate={phoneNumberValidator}
          onChange={e => this.setState({ phoneNumber: e.target.value })}
        />
        <SubmitButton disabled type="submit">
          sign up
        </SubmitButton>
      </Form>
    );
  }
}

export default SignupForm;
