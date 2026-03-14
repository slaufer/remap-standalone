/* eslint-disable no-undef */
import React from 'react';
import './KeymapListPopover.scss';
import {
  KeymapListPopoverActionsType,
  KeymapListPopoverStateType,
} from './KeymapListPopover.container';
import { Button, Popover } from '@mui/material';
import { t } from 'i18next';

type PopoverPosition = {
  left: number;
  top: number;
};

type OwnProps = {
  open: boolean;
  position: PopoverPosition | null;
  onClose: () => void;
};

type KeymapListPopoverProps = OwnProps &
  Partial<KeymapListPopoverActionsType> &
  Partial<KeymapListPopoverStateType>;

type OwnState = {
  popoverPosition: PopoverPosition;
};

export default class KeymapListPopover extends React.Component<
  KeymapListPopoverProps,
  OwnState
> {
  private popoverRef: React.RefObject<HTMLDivElement>;
  constructor(props: OwnProps | Readonly<OwnProps>) {
    super(props);
    this.state = {
      popoverPosition: { top: 0, left: 0 },
    };
    this.popoverRef = React.createRef<HTMLDivElement>();
  }

  private onEnter() {
    if (this.popoverRef.current && this.props.position) {
      const { left, top } = this.props.position;
      const { width, height } = this.popoverRef.current.getBoundingClientRect();
      const iconSize = 30;
      const margin = 10;

      let x = 0;
      let y = 0;
      if (window.innerWidth < left + width + iconSize + margin) {
        x = Math.min(left, left - (width - (window.innerWidth - left)));
        y = top + iconSize + margin;
      } else {
        x = left + iconSize + margin;
        y = top - height / 2 + iconSize / 2;
      }
      this.setState({ popoverPosition: { left: x, top: y } });
    }
  }

  render() {
    if (!this.props.position) {
      return <></>;
    }

    return (
      <Popover
        open={this.props.open}
        anchorReference="anchorPosition"
        anchorPosition={this.state.popoverPosition}
        TransitionProps={{
          onEnter: this.onEnter.bind(this),
        }}
        onClose={() => {
          this.props.onClose();
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        className="keymaplist-root"
      >
        <div className="keymaplist-popover" ref={this.popoverRef}>
          <RequestSignIn onClickSignIn={() => {}} />
        </div>
      </Popover>
    );
  }
}

type RequestSignInType = {
  onClickSignIn: () => void;
};
function RequestSignIn(props: RequestSignInType) {
  return (
    <div className="request-signin">
      <div>
        {t(
          'You can save/restore the current keymap. Using this feature, you can manage many kinds of keymaps.'
        )}
      </div>
      <div className="request-signin-message">
        {t('*You need to sign in to use this feature.')}
      </div>
      <div className="request-signin-actions">
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            props.onClickSignIn();
          }}
        >
          {t('SignIn')}
        </Button>
      </div>
    </div>
  );
}
