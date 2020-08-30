import React from 'react';
import styled from 'styled-components/macro';
import { Link } from 'react-router-dom';
import { headerItem } from '../shared/helpers';

const Logo = styled(Link)`
  ${headerItem};

  margin-right: auto;
  font-size: 24px;
  font-weight: 500;
  color: ${props => props.theme.normalText};
  text-decoration: none;

  @media (max-width: 425px) {
    padding: 0 8px 0 16px;
    font-size: 19px;
  }
`;

const LogoImgDark = styled.img`
  height: 28px;
  margin-left: -8px;
  display: ${props => props.theme.darkLogoDisplay};
`;

const LogoImgLight = styled.img`
  height: 28px;
  margin-left: -8px;
  display: ${props => props.theme.lightLogoDisplay};
`;

export default props => {
  return (
    <Logo to='/'>
      <LogoImgDark src='/logo.svg' alt='Logo' />
      <LogoImgLight src='/logo-white.svg' alt='Logo' />
    </Logo>
  );
};
