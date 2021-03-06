import { combineReducers } from 'redux';
// import { routerReducer as routing } from 'react-router';
import actionState from './actionState';
import appState from './appState';
import claimableState from './claimableState';
import commentsState from './commentsState';
import dashboardState from './dashboardState';
import draftState from './draftState';
import entryState from './entryState';
import errorState from './errorState';
import externalProcState from './externalProcState';
import highlightState from './highlightState';
import licenseState from './licenseState';
import listState from './listState';
import notificationsState from './notificationsState';
import profileState from './profileState';
import searchState from './searchState';
import settingsState from './settingsState';
import tagState from './tagState';
import tempProfileState from './temp-profile-state';
import utilsState from './utilsState';

const rootReducer = combineReducers({
    actionState,
    appState,
    claimableState,
    commentsState,
    dashboardState,
    draftState,
    entryState,
    errorState,
    externalProcState,
    highlightState,
    licenseState,
    listState,
    notificationsState,
    profileState,
    searchState,
    settingsState,
    tagState,
    tempProfileState,
    utilsState,
    // router: routing,
});

export default rootReducer;
