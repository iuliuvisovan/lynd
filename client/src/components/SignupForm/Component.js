import React from "react";
import { Field } from "redux-form";
import Form from "../shared/form/Form";
import renderField from "../shared/form/renderField";
import { usernameValidator, passwordValidator, phoneNumberValidator, countryValidator } from "../../util/validators";
import SubmitButton from "../shared/form/SubmitButton";
import CountryCodes from "./CountryCodes";
import styled from "styled-components";

const DialCode = styled.div`
  position: relative;
  height: 0;
  top: 32px;
  left: 9px;
  z-index: 5;
  font-size: 15px;
  color: ${props => props.theme.normalText};
  font-family: Arial;
`;

const SubmitButtonWrapper = styled.div`
  position: relative;
  height: 0;
  top: 26px;
  right: 3px;
  align-self: flex-end;
  z-index: 110;
`;

class SignupForm extends React.Component {
  state = {
    currentCountry: null,
    phoneNumber: ""
  };

  componentDidMount() {
    this.redirectIfLoggedIn();
  }

  componentDidUpdate() {
    this.redirectIfLoggedIn();
  }

  redirectIfLoggedIn() {
    if (this.props.token) {
      console.log("this.props.token", this.props.token);

      this.props.history.push("/");
    }
  }

  onSubmit = ({ username, password }) => {
    this.props.attemptSignup(username, password);
  };

  sendCode = () => {
    const dialCode = (CountryCodes.find(x => x.code === this.state.currentCountry) || {}).dial_code || "";
    const { phoneNumber } = this.state;

    this.props.sendSms(dialCode + phoneNumber);
  };

  checkCode = e => {
    const code = e.target.value;
    const dialCode = (CountryCodes.find(x => x.code === this.state.currentCountry) || {}).dial_code || "";
    const { phoneNumber } = this.state;

    console.log("code", code);

    if (code.length == 4) {
      console.log("Checking code");

      this.props.testSms(dialCode + phoneNumber, code);
    }
  };

  render() {
    const { phoneNumber } = this.state;

    const dialCode = (CountryCodes.find(x => x.code === this.state.currentCountry) || {}).dial_code || "";

    const { loading, sendingSms, hasSentSms, hasTestedSms, isCodeValid } = this.props;

    return (
      <Form loading={loading} onSubmit={this.props.handleSubmit(this.onSubmit)}>
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
        <DialCode>{dialCode}</DialCode>
        {dialCode && phoneNumber.length > 8 && (
          <SubmitButtonWrapper>
            <SubmitButton disabled={sendingSms || hasSentSms} onClick={this.sendCode} type="button">
              {sendingSms ? "sending..." : hasSentSms ? "sms sent!" : "send code"}
            </SubmitButton>
          </SubmitButtonWrapper>
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
        {hasSentSms && <Field name="code" onChange={this.checkCode} label="code" type="text" component={renderField} style={{ width: "100px" }} />}
        <span>{"hasTestedSms: " + hasTestedSms}</span>
        <span>{"isCodeValid: " + isCodeValid}</span>
        <SubmitButton disabled type="submit">
          sign up
        </SubmitButton>
      </Form>
    );
  }
}

export default SignupForm;
