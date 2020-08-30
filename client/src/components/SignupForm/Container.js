import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import withAuth from '../../util/withAuth';
import { attemptSignup, requestSendSms } from '../../actions/auth';
import validate from './validate';
import SignupForm from './Component';

const mapStateToProps = state => ({
  loading: state.auth.loading
});

const mapDispatchToProps = { attemptSignup, requestSendSms };

const enhance = compose(
  reduxForm({ form: 'signup', validate }),
  withAuth,
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
);

const SignupFormContainer = enhance(SignupForm);

export default SignupFormContainer;
