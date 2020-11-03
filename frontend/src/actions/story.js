import api from "utils";
import history from "../history";
import {
  SET_SICK_STATUS,
  SET_TESTED_STATUS,
  SET_STORY,
  SAVED_STORY,
  SAVE_STORY_START,
  SUCCESS,
  FETCH_STORY_START,
  FETCH_STORY,
  INVALID_STORY,
  ERROR,
  SUBMIT_TRAVELS_START,
  SUBMIT_TRAVELS,
  SUBMIT_CLOSE_CONTACTS_START,
  SUBMIT_CLOSE_CONTACTS,
  SET_MY_STORY,
  SUBMIT_MY_STORY,
} from "./types";
import { fields } from "../routes/CriticalQuestions/fields";

const mandatoryFields = [fields.STATE, fields.COUNTRY];

const isValidStory = (dto) => invalidFields(dto.story).length === 0;

const invalidFields = (dto) =>
  mandatoryFields.filter((field) => !(field.key in dto && dto[field.key]));

export const setStory = (story) => async (dispatch) => {
  dispatch({
    type: SET_STORY,
    payload: story,
  });
};

export const submitStory = (dto, update = false) => async (dispatch) => {
  if (!isValidStory(dto) && !update) {
    return dispatch({
      type: INVALID_STORY,
      payload: {
        status: {
          type: ERROR,
          detail: `Please complete the following fields: ${invalidFields(dto)
            .map((field) => field.label)
            .join(", ")}`,
        },
      },
    });
  }

  dispatch({ type: SAVE_STORY_START });
  const { story, nextPage, travels, closeContacts } = dto;
  const {
    error,
    travels: _travels,
    closeContacts: _closeContacts,
    ...updatedStory
  } = await api(`stories/`, {
    method: "POST",
    body: story,
  });

  dispatch({
    type: SAVED_STORY,
    payload: {
      status: error || { type: SUCCESS },
      story: (!error && updatedStory) || null,
      tempStory: null,
    },
  });

  const storyId = updatedStory.id;
  const sendTravels = () =>
    travels.length && dispatch(submitTravels(travels, storyId));
  const sendCloseContacts = () =>
    closeContacts.length &&
    dispatch(submitCloseContacts(closeContacts, storyId));
  const anyError = await [sendTravels, sendCloseContacts].reduce(
    async (error, func) => !(await error) && func(),
    error
  );

  if (!anyError) {
    history.push(nextPage);
  }
};

export const setMyStory = (myStory) => (dispatch) => {
  dispatch({
    type: SET_MY_STORY,
    payload: myStory,
  });
};

export const submitMyStory = (id, mystory) => async (dispatch) => {
  const payload = { latestMyStory: mystory };

  dispatch({
    type: SUBMIT_MY_STORY,
    payload: payload,
  });

  const newMyStory = { text: mystory, story_id: id };
  await api(`stories/${id}/my_stories`, {
    method: "POST",
    body: newMyStory,
  });
};

export const setSickStatus = (option) => (dispatch) => {
  dispatch({
    type: SET_SICK_STATUS,
    payload: option,
  });
};

export const setTestedStatus = (option) => (dispatch) => {
  dispatch({
    type: SET_TESTED_STATUS,
    payload: option,
  });
};

export const fetchStory = () => async (dispatch) => {
  await getCurrentStory(dispatch);
};

export const getCurrentStory = async (dispatch) => {
  dispatch({ type: FETCH_STORY_START });
  const { error, travels, closeContacts, ...story } = await api("stories/");
  dispatch({
    type: FETCH_STORY,
    payload: {
      status: error || { type: SUCCESS },
      story: (!error && story) || null,
      travels: (!error && travels) || [],
      closeContacts: (!error && closeContacts) || [],
    },
  });
  return story;
};

/**
 * backend call to create or update like/dislike
 * @param my_story_id id of the my story to update
 * @param like a boolean. like when true, dislike when false and neither when null.
 * @returns {Promise<*>} returns when there is any error
 */
export const updateLike = async (my_story_id, like) => {
  const dto = {
    like: like,
    my_story_id: target_story_id,
  };

  const { error } = await api(`likes/`, { method: "POST", body: dto });
  return error;
};

const submitTravels = (travels, storyId) =>
  submitStoryComponents(storyId)(
    "travels",
    travels,
    { type: SUBMIT_TRAVELS_START },
    (errors, response) => ({
      type: SUBMIT_TRAVELS,
      payload: {
        status: errors || { type: SUCCESS },
        travels: (!errors && response) || [],
      },
    })
  );

const submitCloseContacts = (closeContacts, storyId) =>
  submitStoryComponents(storyId)(
    "contacts",
    closeContacts,
    { type: SUBMIT_CLOSE_CONTACTS_START },
    (errors, response) => ({
      type: SUBMIT_CLOSE_CONTACTS,
      payload: {
        status: errors || { type: SUCCESS },
        closeContacts: (!errors && response) || [],
      },
    })
  );

const submitStoryComponents = (storyId) => (
  path,
  components,
  before,
  after
) => async (dispatch) => {
  dispatch(before);

  let parsedComponents = components.map((component) => ({
    ...component,
    storyId,
  }));
  const newComponents = parsedComponents.filter(
    (component) => !("id" in component)
  );
  const updatedComponents = parsedComponents.filter(
    (component) => "id" in component
  );
  const postResponse =
    newComponents.length &&
    (await api(`stories/${storyId}/${path}`, {
      method: "POST",
      body: newComponents,
    }));

  const putResponse =
    updatedComponents.length &&
    (await api(`stories/${storyId}/${path}`, {
      method: "PUT",
      body: updatedComponents,
    }));

  const errors = postResponse.error || putResponse.error;
  const response = (!postResponse.error && postResponse
    ? postResponse
    : []
  ).concat(!putResponse.error && putResponse ? putResponse : []);

  dispatch(after(errors, response));
  return errors;
};
