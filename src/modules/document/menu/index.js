import ClearEditor from "./clearEditor";
import OpenMenu from "./openDocument";
import SaveMenu from "./saveDocument";
import SaveDataMenu from "./saveDatas";

export const ClearEditorMenuConf = {
    key: 'clearEditor',
    factory() {
        return new ClearEditor()
    },
}

export const OpenDocumentMenuConf = {
    key: 'openDocument',
    factory() {
        return new OpenMenu()
    },
}

export const SaveDocumentMenuConf = {
    key: 'saveDocument',
    factory() {
        return new SaveMenu()
    },
}

export const SaveDataMenuConf = {
    key: 'saveData',
    factory() {
        return new SaveDataMenu()
    },
}