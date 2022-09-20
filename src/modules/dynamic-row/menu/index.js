import InsertDynamicRow from "./insertDynamicRow";
import SwitchDynamicRow from "./switchDynamicRow";
import CancelDynamicRow from "./cancelDynamicRow";

export const InsertDynamicRowMenuConf = {
    key: 'insertDynamicRow',
    factory() {
        return new InsertDynamicRow()
    },
}

export const SwitchDynamicRowMenuConf = {
    key: 'switchDynamicRow',
    factory() {
        return new SwitchDynamicRow()
    },
}

export const CancelDynamicRowMenuConf = {
    key: 'cancelDynamicRow',
    factory() {
        return new CancelDynamicRow()
    },
}