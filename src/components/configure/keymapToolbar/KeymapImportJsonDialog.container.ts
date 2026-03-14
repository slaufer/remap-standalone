import { connect } from 'react-redux';
import KeymapImportJsonDialog from './KeymapImportJsonDialog';
import { RootState } from '../../../store/state';
import {
  AppActions,
  KeydiffActions,
  LayoutOptionsActions,
} from '../../../actions/actions';
import {
  KeymapJsonData,
  convertJsonDataToEncoderRemaps,
  convertJsonDataToRemaps,
} from '../../../utils/KeymapJsonSerializer';
import { sendEventToGoogleAnalytics } from '../../../utils/GoogleAnalytics';
import { ThunkDispatch } from 'redux-thunk';
import { ThunkAction } from 'redux-thunk';

type ActionTypes = ReturnType<
  | (typeof AppActions)[keyof typeof AppActions]
  | (typeof KeydiffActions)[keyof typeof KeydiffActions]
  | (typeof LayoutOptionsActions)[keyof typeof LayoutOptionsActions]
>;
type ThunkVoidAction = ThunkAction<void, RootState, undefined, ActionTypes>;

const mapStateToProps = (state: RootState) => {
  const info = state.entities.keyboard?.getInformation();
  return {
    vendorId: info?.vendorId,
    productId: info?.productId,
  };
};
export type KeymapImportJsonDialogStateType = ReturnType<
  typeof mapStateToProps
>;

const mapDispatchToProps = (
  dispatch: ThunkDispatch<RootState, undefined, ActionTypes>
) => {
  return {
    applyKeymapJson: (data: KeymapJsonData): void => {
      const thunk: ThunkVoidAction = (_dispatch, getState) => {
        const { entities } = getState();
        const keymaps = entities.device.keymaps;
        const encodersKeymaps = entities.device.encodersKeymaps;
        const layerCount = entities.device.layerCount;
        const keyboardDefinition = entities.keyboardDefinition;
        const info = entities.keyboard?.getInformation();

        const remaps = convertJsonDataToRemaps(
          data,
          keymaps,
          keyboardDefinition?.customKeycodes
        );
        const encoderRemaps = convertJsonDataToEncoderRemaps(
          data,
          encodersKeymaps,
          layerCount,
          keyboardDefinition?.customKeycodes
        );

        _dispatch(AppActions.updateLangLabel(data.labelLang));
        _dispatch(KeydiffActions.clearKeydiff());
        _dispatch(AppActions.remapsSetKeys(remaps));
        _dispatch(AppActions.encodersRemapsSetKeys(encoderRemaps));
        _dispatch(LayoutOptionsActions.restoreLayoutOptions(data.layoutOptions));

        sendEventToGoogleAnalytics('configure/import_keymap_json', {
          vendor_id: info?.vendorId,
          product_id: info?.productId,
          product_name: info?.productName,
        });
      };
      dispatch(thunk);
    },
  };
};

export type KeymapImportJsonDialogActionsType = ReturnType<
  typeof mapDispatchToProps
>;

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KeymapImportJsonDialog);
