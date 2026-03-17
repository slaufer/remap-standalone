import React from 'react';
import { FooterActionsType, FooterStateType } from './Footer.container';
import './Footer.scss';
import { format } from 'date-fns';

type FooterState = {};

type OwnProps = {};
type FooterPropsType = OwnProps &
  Partial<FooterActionsType> &
  Partial<FooterStateType>;

export default class Footer extends React.Component<
  FooterPropsType,
  FooterState
> {
  constructor(props: FooterPropsType | Readonly<FooterPropsType>) {
    super(props);
  }
  render() {
    return (
      <footer className="footer">
        <div className="footer-dev-team">
          ©{' '}
          <span className="footer-dev-team-years">
            2020-{format(new Date(), 'yyyy')}
          </span>
          <span>Remap team</span>
        </div>
        <div className="app-version">Build: {this.props.buildNumber}</div>
      </footer>
    );
  }
}
