import { objectNoId } from '../reducers/object'
import Validator from 'validatorjs';
import { GlobalStore } from '../index';
import { actionTypes } from 'redux-localstorage'
import { macros, MACROS_INITIALSTATE } from './macros'

export const version = require("../../package.json").version;

export const SETTINGS_VALIDATION_RULES = {
    machineWidth: 'numeric|min:100',
    machineHeight: 'numeric|min:100',

    gcodeSMaxValue: 'required|numeric|min:1',
    gcodeMoveUnits: 'in:mm/s,mm/min',
    gcodeToolTestPower: 'required|numeric|min:0|max:100',
    gcodeToolTestDuration: 'required|numeric|min:0',
    gcodeConcurrency: 'required|numeric|min:1|max:5',

    machineZEnabled: 'boolean',
    machineBlowerEnabled: 'boolean',
    machineZToolOffset: 'numeric',

    machineAEnabled: 'boolean',

    toolGridWidth: 'numeric|min:100',
    toolGridHeight: 'numeric|min:100',
    toolImagePosition: 'in:TL,TR,C,BL,BR',

    toolGridMinorSpacing: 'numeric|min:0.1',
    toolGridMajorSpacing: 'numeric|min:1',

    jogFeedXY: 'numeric|min:0',
    jogFeedZ: 'numeric|min:0',

}


export function ValidateSettings(bool = true, rules = SETTINGS_VALIDATION_RULES, settings = null) {

    if (!settings)
        settings = Object.assign({}, GlobalStore().getState().settings)

    let check = new Validator(settings, rules);

    if (bool)
        return check.passes();

    return check;
}

export const SETTINGS_INITIALSTATE = {

    __version: version,
    __selectedProfile: null,

    machineWidth: 300,
    machineHeight: 200,
    machineBeamDiameter: 0.2,
    machineBottomLeftX: 0,
    machineBottomLeftY: 0,

    machineFeedRange: {
        XY: {min: 1, max:50000},
        Z: {min: 1, max:50000},
        A: {min: 1, max:50000},
        S: {min: 0, max:30000},
    },

    machineZEnabled: false,
    machineZMatThickness: 0,
    machineZToolOffset: 0,
    machineZStartHeight: '',

    machineAEnabled: false,

    machineBlowerEnabled: false,
    machineBlowerGcodeOn: '',
    machineBlowerGcodeOff: '',

    pxPerInch: 96,
    dpiBitmap: 300,

    toolGridWidth: 500,
    toolGridHeight: 500,
    toolGridMinorSpacing: 10,
    toolGridMajorSpacing: 50,
    toolSafetyLockDisabled: true,
    toolCncMode: false,
    toolImagePosition: "BL",
    toolUseNumpad: false,
    toolDisplayCache: false,

    toolVideoDevice: null,
    toolVideoPerspective: { enabled: false },
    toolVideoLens: { a: 1, b: 1, F: 1, scale: 1 },
    toolVideoFov: { x: 1, y: 1 },
    toolVideoResolution: "720p(HD)",

    toolWebcamUrl: "",
    toolFeedUnits: 'mm/min',
    toolTestSValue: 1,
    toolTestDuration: 0,

    gcodeStart: "G21         ; Set units to mm\r\nG90         ; Absolute positioning\r\n",
    gcodeEnd: "M5          ; Switch tool offEnd\r\nM2          ; End\r\n",
    gcodeHoming: "",
    gcodeToolOn: "",
    gcodeToolOff: "",
    gcodeSMaxValue: 1,
    gcodeCheckSizePower: 0,
    gcodeToolTestPower: 0,
    gcodeToolTestDuration: 0,
    gcodeConcurrency: 2,

    comServerVersion: 'not connected',
    comServerIP: 'localhost:8000',
    comServerConnect: false,
    comInterfaces: [],
    comPorts: [],
    connectVia: '',
    connectPort: '',
    connectBaud: '115200',
    connectIP: '',

    jogStepsize: 1,
    jogFeedXY: 1800,
    jogFeedZ: 300,
    jogAccumulatedJobTime: 0,

    macros: MACROS_INITIALSTATE
}

export const settings = (state, action) => {
    state = objectNoId('settings', SETTINGS_INITIALSTATE)(state, action);
    Object.assign(state, { macros: macros(state.macros||{}, action)});
    switch (action.type) {
        case actionTypes.INIT:
            state = Object.assign({}, state, { __version: version })
            break;
    }
    return state;
}
