/* eslint-disable no-undef */
import React from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import { t } from 'i18next';
import {
  KeymapImportJsonDialogActionsType,
  KeymapImportJsonDialogStateType,
} from './KeymapImportJsonDialog.container';
import {
  deserializeKeymapFromJson,
  KeymapJsonData,
} from '../../../utils/KeymapJsonSerializer';

type OwnProps = {
  open: boolean;
  onClose: () => void;
};

type KeymapImportJsonDialogProps = OwnProps &
  Partial<KeymapImportJsonDialogActionsType> &
  Partial<KeymapImportJsonDialogStateType>;

type OwnState = {
  parsedData: KeymapJsonData | null;
  fileName: string | null;
  errorMessage: string | null;
  mismatchWarning: string | null;
};

export default class KeymapImportJsonDialog extends React.Component<
  KeymapImportJsonDialogProps,
  OwnState
> {
  private fileInputRef: React.RefObject<HTMLInputElement>;

  constructor(
    props: KeymapImportJsonDialogProps | Readonly<KeymapImportJsonDialogProps>
  ) {
    super(props);
    this.state = {
      parsedData: null,
      fileName: null,
      errorMessage: null,
      mismatchWarning: null,
    };
    this.fileInputRef = React.createRef<HTMLInputElement>();
  }

  private onEnter() {
    this.setState({
      parsedData: null,
      fileName: null,
      errorMessage: null,
      mismatchWarning: null,
    });
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = '';
    }
  }

  private onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const raw = e.target?.result as string;
      const result = deserializeKeymapFromJson(raw);
      if (!result.success) {
        this.setState({
          parsedData: null,
          fileName: file.name,
          errorMessage: result.error,
          mismatchWarning: null,
        });
        return;
      }

      const data = result.data;
      let mismatchWarning: string | null = null;
      if (
        this.props.vendorId !== undefined &&
        this.props.productId !== undefined &&
        (data.vendorId !== this.props.vendorId ||
          data.productId !== this.props.productId)
      ) {
        mismatchWarning = t(
          'This keymap was exported from a different keyboard ({{name}}). It may not work correctly.',
          { name: data.productName }
        );
      }

      this.setState({
        parsedData: data,
        fileName: file.name,
        errorMessage: null,
        mismatchWarning,
      });
    };
    reader.readAsText(file);
  }

  private onClickApply() {
    if (!this.state.parsedData) return;
    this.props.applyKeymapJson!(this.state.parsedData);
    this.props.onClose();
  }

  render() {
    const { parsedData, fileName, errorMessage, mismatchWarning } = this.state;

    return (
      <Dialog
        open={this.props.open}
        maxWidth={'sm'}
        fullWidth
        PaperComponent={PaperComponent}
        className="keymap-import-json-dialog"
        TransitionProps={{
          onEnter: this.onEnter.bind(this),
        }}
      >
        <DialogTitle id="draggable-dialog-title" style={{ cursor: 'move' }}>
          {t('Import Keymap from JSON')}
          <div className="close-dialog" style={{ float: 'right' }}>
            <CloseIcon
              onClick={this.props.onClose}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </DialogTitle>
        <DialogContent dividers>
          <p>
            {t(
              'Select a keymap JSON file previously exported from Remap to apply it to the connected keyboard.'
            )}
          </p>
          <input
            ref={this.fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={this.onFileChange.bind(this)}
            style={{ display: 'block', marginBottom: '16px' }}
          />
          {errorMessage && (
            <Alert severity="error" style={{ marginBottom: '8px' }}>
              {errorMessage}
            </Alert>
          )}
          {mismatchWarning && (
            <Alert severity="warning" style={{ marginBottom: '8px' }}>
              {mismatchWarning}
            </Alert>
          )}
          {parsedData && !errorMessage && (
            <Alert severity="success">
              {t('Ready to import: {{fileName}}', { fileName })}
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.onClose} color="primary">
            {t('Cancel')}
          </Button>
          <Button
            onClick={this.onClickApply.bind(this)}
            color="primary"
            variant="contained"
            disabled={!parsedData || !!errorMessage}
          >
            {t('Apply')}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}
