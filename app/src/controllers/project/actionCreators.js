import { fetch } from 'common/utils';
import { URLS } from 'common/urls';
import { userIdSelector, activeProjectSelector } from 'controllers/user';
import {
  fetchUserFiltersSuccessAction,
  removeFilterAction,
  addFilterAction,
} from 'controllers/filter';
import { projectIdSelector } from 'controllers/pages';
import {
  FETCH_PROJECT_SUCCESS,
  FETCH_PROJECT_PREFERENCES_SUCCESS,
  UPDATE_CONFIGURATION_ATTRIBUTES,
  UPDATE_NOTIFICATIONS_CONFIG_SUCCESS,
  UPDATE_DEFECT_SUBTYPE,
  UPDATE_DEFECT_SUBTYPE_SUCCESS,
  ADD_DEFECT_SUBTYPE,
  ADD_DEFECT_SUBTYPE_SUCCESS,
  DELETE_DEFECT_SUBTYPE,
  DELETE_DEFECT_SUBTYPE_SUCCESS,
} from './constants';
import { projectNotificationsConfigurationSelector } from './selectors';

const fetchProjectSuccessAction = (project) => ({
  type: FETCH_PROJECT_SUCCESS,
  payload: project,
});

const fetchProjectPreferencesSuccessAction = (preferences) => ({
  type: FETCH_PROJECT_PREFERENCES_SUCCESS,
  payload: preferences,
});

export const updateConfigurationAttributesAction = (project) => ({
  type: UPDATE_CONFIGURATION_ATTRIBUTES,
  payload: project.configuration.attributes,
});

export const updateProjectFilterPreferencesAction = (filterId, method) => (dispatch, getState) =>
  fetch(
    URLS.projectPreferences(
      activeProjectSelector(getState()),
      userIdSelector(getState()),
      filterId,
    ),
    {
      method,
    },
  );
export const updateProjectNotificationsConfig = (notificationsConfig) => (dispatch, getState) => {
  const currentConfig = projectNotificationsConfigurationSelector(getState());
  const newConfig = { ...currentConfig, ...notificationsConfig };
  fetch(URLS.projectNotificationConfiguration(projectIdSelector(getState())), {
    method: 'PUT',
    data: newConfig,
  }).then(() => {
    dispatch({
      type: UPDATE_NOTIFICATIONS_CONFIG_SUCCESS,
      payload: newConfig,
    });
  });
};

export const showFilterOnLaunchesAction = (filter) => (dispatch) => {
  dispatch(addFilterAction(filter));
  dispatch(updateProjectFilterPreferencesAction(filter.id, 'PUT'));
};

export const hideFilterOnLaunchesAction = (filter) => (dispatch) => {
  dispatch(removeFilterAction(filter.id));
  dispatch(updateProjectFilterPreferencesAction(filter.id, 'DELETE'));
};

const fetchProjectPreferencesAction = (projectId) => (dispatch, getState) =>
  fetch(URLS.projectPreferences(projectId, userIdSelector(getState()))).then((preferences) => {
    dispatch(fetchProjectPreferencesSuccessAction(preferences));
    dispatch(fetchUserFiltersSuccessAction(preferences.filters));
  });

export const fetchProjectAction = (projectId, isAdminAccess) => (dispatch) =>
  fetch(URLS.project(projectId)).then((project) => {
    dispatch(fetchProjectSuccessAction(project));
    !isAdminAccess && dispatch(fetchProjectPreferencesAction(projectId));
  });

export const fetchConfigurationAttributesAction = (projectId) => (dispatch) => {
  fetch(URLS.project(projectId)).then((project) => {
    dispatch(updateConfigurationAttributesAction(project));
  });
};

export const updateDefectSubTypeAction = (subType) => ({
  type: UPDATE_DEFECT_SUBTYPE,
  payload: subType,
});

export const updateDefectSubTypeSuccessAction = (subType) => ({
  type: UPDATE_DEFECT_SUBTYPE_SUCCESS,
  payload: subType,
});

export const addDefectSubTypeAction = (subType) => ({
  type: ADD_DEFECT_SUBTYPE,
  payload: subType,
});

export const addDefectSubTypeSuccessAction = (subType) => ({
  type: ADD_DEFECT_SUBTYPE_SUCCESS,
  payload: subType,
});

export const deleteDefectSubTypeAction = (subType) => ({
  type: DELETE_DEFECT_SUBTYPE,
  payload: subType,
});

export const deleteDefectSubTypeSuccessAction = (subType) => ({
  type: DELETE_DEFECT_SUBTYPE_SUCCESS,
  payload: subType,
});
