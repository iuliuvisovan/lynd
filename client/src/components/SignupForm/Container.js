import { connect } from 'react-redux';
import { compose } from 'redux';
import { reduxForm } from 'redux-form';
import withAuth from '../../util/withAuth';
import { attemptSignup, sendSms, testSms } from '../../actions/auth';
import validate from './validate';
import SignupForm from './Component';

const mapStateToProps = state => ({
  sendingSms: state.auth.sendingSms,
  hasTestedSms: state.auth.hasTestedSms,
  isCodeValid: state.auth.isCodeValid,
  isSmsCheckFinalized: state.auth.isSmsCheckFinalized,
  loading: state.auth.loading,
});

const mapDispatchToProps = { attemptSignup, sendSms, testSms };

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
