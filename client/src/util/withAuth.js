import { connect } from 'react-redux';

export default function withAuth (WrappedComponent) {
  const mapStateToProps = state => ({
    hasSentSms: state.auth.hasSentSms,
    token: state.auth.token,
    user: state.auth.user
  });

  return connect(mapStateToProps)(WrappedComponent);
}
