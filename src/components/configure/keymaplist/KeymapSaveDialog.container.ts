import { connect } from 'react-redux';
import KeymapSaveDialog from './KeymapSaveDialog';
import { RootState } from '../../../store/state';
import { SavedKeymapData } from '../../../services/storage/Storage';

const mapStateToProps = (state: RootState) => {
  return {
    keyboard: state.entities.keyboard,
    keymaps: state.entities.device.keymaps,
    encodersKeymaps: state.entities.device.encodersKeymaps,
    labelLang: state.app.labelLang,
    layerCount: state.entities.device.layerCount,
    layoutLabels: state.entities.keyboardDefinition?.layouts.labels,
    selectedLayoutOptions: state.configure.layoutOptions.selectedOptions,
    keyboardDefinitionDocument: state.entities.keyboardDefinitionDocument,
  };
};
export type KeymapSaveDialogStateType = ReturnType<typeof mapStateToProps>;

const mapDispatchToProps = (_dispatch: any) => {
  return {
    // eslint-disable-next-line no-unused-vars
    createSavedKeymap: (_keymapData: SavedKeymapData) => {
      // Cloud feature removed
    },
    // eslint-disable-next-line no-unused-vars
    updateSavedKeymap: (_keymapData: SavedKeymapData) => {
      // Cloud feature removed
    },
    // eslint-disable-next-line no-unused-vars
    deleteSavedKeymap: (_keymapData: SavedKeymapData) => {
      // Cloud feature removed
    },
  };
};

export type KeymapSaveDialogActionsType = ReturnType<typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(KeymapSaveDialog);
