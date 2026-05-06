"use client";

import { createContext, useCallback, useMemo, useReducer } from "react";
import * as contentService from "@/services/content.service";
import * as approvalService from "@/services/approval.service";

export const ContentContext = createContext(null);

const initialState = {
  items: [],
  pending: [],
  loading: false,
  error: null
};

function contentReducer(state, action) {
  switch (action.type) {
    case "REQUEST":
      return { ...state, loading: true, error: null };
    case "ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_ITEMS":
      return { ...state, loading: false, items: action.payload, error: null };
    case "SET_PENDING":
      return { ...state, loading: false, pending: action.payload, error: null };
    case "ADD_ITEM":
      return { ...state, loading: false, items: [action.payload, ...state.items], error: null };
    case "UPDATE_ITEM": {
      const update = (item) => (item.id === action.payload.id ? action.payload : item);
      return {
        ...state,
        loading: false,
        items: state.items.map(update),
        pending: state.pending.filter((item) => item.id !== action.payload.id),
        error: null
      };
    }
    default:
      return state;
  }
}

export function ContentProvider({ children }) {
  const [state, dispatch] = useReducer(contentReducer, initialState);

  const runRequest = useCallback(async (request, onSuccess) => {
    dispatch({ type: "REQUEST" });
    try {
      const result = await request();
      onSuccess(result);
      return result;
    } catch (error) {
      dispatch({ type: "ERROR", payload: error.message || "Something went wrong" });
      throw error;
    }
  }, []);

  const fetchMyContent = useCallback(
    (teacherId) => runRequest(() => contentService.getMyContent(teacherId), (items) => dispatch({ type: "SET_ITEMS", payload: items })),
    [runRequest]
  );

  const fetchAllContent = useCallback(
    () => runRequest(contentService.getAllContent, (items) => dispatch({ type: "SET_ITEMS", payload: items })),
    [runRequest]
  );

  const fetchPendingContent = useCallback(
    () => runRequest(contentService.getPendingContent, (items) => dispatch({ type: "SET_PENDING", payload: items })),
    [runRequest]
  );

  const uploadContent = useCallback(
    (data) => runRequest(() => contentService.uploadContent(data), (item) => dispatch({ type: "ADD_ITEM", payload: item })),
    [runRequest]
  );

  const approve = useCallback(
    (contentId) => runRequest(() => approvalService.approveContent(contentId), (item) => dispatch({ type: "UPDATE_ITEM", payload: item })),
    [runRequest]
  );

  const reject = useCallback(
    (contentId, reason) =>
      runRequest(() => approvalService.rejectContent(contentId, reason), (item) => dispatch({ type: "UPDATE_ITEM", payload: item })),
    [runRequest]
  );

  const value = useMemo(
    () => ({
      ...state,
      fetchMyContent,
      fetchAllContent,
      fetchPendingContent,
      uploadContent,
      approve,
      reject
    }),
    [state, fetchMyContent, fetchAllContent, fetchPendingContent, uploadContent, approve, reject]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}
