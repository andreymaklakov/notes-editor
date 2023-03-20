import { createSlice } from "@reduxjs/toolkit";

import { AppThunk, RootState } from "./createStore";

import { Note } from "../../types";

import notesData from "../data/notes.json";
import tagsData from "../data/tags.json";

interface State {
  notesField: string;
  searchField: string;
  selectedTags: string[];
  newTags: string;
  allNotes: Note[];
  allTags: string[];
  isEdit: boolean;
  isEditNote: Note | null;
  isEditNoteIndex: number | null;
}

const initialState: State = {
  notesField: "",
  searchField: "",
  selectedTags: [],
  newTags: "",
  allNotes: [],
  allTags: [],
  isEdit: false,
  isEditNote: null,
  isEditNoteIndex: null,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    notesLoaded(state, action) {
      state.allNotes = action.payload;
    },
    tagsLoaded(state, action) {
      state.allTags = action.payload;
    },
    notesFieldChanged(state, action) {
      state.notesField = action.payload;
    },
    isEditNoteChanged(state, action) {
      if (state.isEditNote) {
        state.isEditNote.note = action.payload;
      }
    },
    selectedTagsChanged(state, action) {
      state.selectedTags = action.payload;
    },
    isEditNoteSelectedTagsChanged(state, action) {
      if (state.isEditNote) {
        state.isEditNote.tags = action.payload;
      }
    },
    newTagsChanged(state, action) {
      state.newTags = action.payload;
    },
    fieldsCleaned(state) {
      state.notesField = "";
      state.selectedTags = [];
      state.newTags = "";
    },
    noteAdded(state) {
      let newTagsArray: string[] = [];

      if (state.newTags) {
        newTagsArray = state.newTags.split(",");
      }

      if (state.isEdit) {
        const containsHashTag = state.isEditNote?.note.includes("#");
        if (containsHashTag) {
          let isEditNoteArray = state.isEditNote?.note
            .replace(/\n/g, " ")
            .split(" ");

          if (isEditNoteArray) {
            isEditNoteArray = isEditNoteArray.map((word) => {
              if (word.includes("#")) {
                word = word.slice(1);

                const newTag = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
                console.log(newTag);

                state.allTags = [...state.allTags, newTag];
                if (state.isEditNote) {
                  state.isEditNote.tags = [...state.isEditNote.tags, newTag];
                }

                return word;
              }
              return word;
            });

            state.isEditNote!.note = isEditNoteArray.join(" ");
          }
        }

        state.allTags = [...state.allTags, ...newTagsArray];

        if (state.isEditNote) {
          state.isEditNote.tags = [...state.isEditNote.tags, ...newTagsArray];
        }

        state.allNotes = state.allNotes.map((note, i) =>
          i === state.isEditNoteIndex ? state.isEditNote! : note
        );

        localStorage.setItem("notes", JSON.stringify(state.allNotes));
        localStorage.setItem("tags", JSON.stringify(state.allTags));

        state.isEdit = false;
        state.isEditNoteIndex = null;

        return;
      }

      state.selectedTags = [...state.selectedTags, ...newTagsArray];

      const newNote = { note: state.notesField, tags: state.selectedTags };

      state.allTags = [...state.allTags, ...newTagsArray];
      state.allNotes = [...state.allNotes, newNote];

      localStorage.setItem("notes", JSON.stringify(state.allNotes));
      localStorage.setItem("tags", JSON.stringify(state.allTags));
    },
    noteDeleted(state, action) {
      state.allNotes = state.allNotes.filter((_, i) => i !== action.payload);

      localStorage.setItem("notes", JSON.stringify(state.allNotes));
    },
    isEditActive(state) {
      state.isEdit = true;
    },
    isEditNoteGotten(state, action) {
      state.isEditNoteIndex = action.payload;
      state.isEditNote = state.allNotes.find((_, i) => i === action.payload)!;
    },
    searchFieldChanged(state, action) {
      state.searchField = action.payload;
    },
  },
});

const { reducer: notesReducer, actions } = notesSlice;
const {
  notesFieldChanged,
  selectedTagsChanged,
  fieldsCleaned,
  noteAdded,
  newTagsChanged,
  noteDeleted,
  isEditActive,
  isEditNoteGotten,
  isEditNoteChanged,
  isEditNoteSelectedTagsChanged,
  searchFieldChanged,
  notesLoaded,
  tagsLoaded,
} = actions;

export const loadNotes =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    const myNotes = localStorage.getItem("notes");
    const myTags = localStorage.getItem("tags");

    if (!myNotes) {
      localStorage.setItem("notes", JSON.stringify(notesData));
    }
    if (!myTags) {
      localStorage.setItem("tags", JSON.stringify(tagsData));
    }

    if (myNotes && myTags) {
      await dispatch(notesLoaded(JSON.parse(myNotes)));
      await dispatch(tagsLoaded(JSON.parse(myTags)));
    }
  };

export const changeSearchField =
  (value: string): AppThunk =>
  (dispatch): void => {
    dispatch(searchFieldChanged(value));
  };

export const changeNotesField =
  (value: string): AppThunk =>
  (dispatch): void => {
    dispatch(notesFieldChanged(value));
  };

export const changeIsEditNote =
  (value: string): AppThunk =>
  (dispatch): void => {
    dispatch(isEditNoteChanged(value));
  };

export const changeSelectedTags =
  (value: string[]): AppThunk =>
  (dispatch): void => {
    dispatch(selectedTagsChanged(value));
  };

export const changeIsEditNoteSelectedTags =
  (value: string[]): AppThunk =>
  (dispatch): void => {
    dispatch(isEditNoteSelectedTagsChanged(value));
  };

export const changeNewTags =
  (value: string): AppThunk =>
  (dispatch): void => {
    dispatch(newTagsChanged(value));
  };

export const addNote =
  (): AppThunk =>
  (dispatch): void => {
    dispatch(noteAdded());
    dispatch(fieldsCleaned());
  };

export const deleteNote =
  (index: number): AppThunk =>
  (dispatch): void => {
    dispatch(noteDeleted(index));
  };

export const getIsEditNote =
  (index: number): AppThunk =>
  (dispatch): void => {
    dispatch(isEditActive());
    dispatch(isEditNoteGotten(index));
  };

export const getNote = () => (state: RootState) => state.notes.notesField;
export const getSearch = () => (state: RootState) => state.notes.searchField;
export const getTags = () => (state: RootState) => state.notes.selectedTags;
export const getAllNotes = () => (state: RootState) => state.notes.allNotes;
export const getAllTags = () => (state: RootState) => state.notes.allTags;
export const getNewTags = () => (state: RootState) => state.notes.newTags;
export const getIsEdit = () => (state: RootState) => state.notes.isEdit;
export const getEditNote = () => (state: RootState) => state.notes.isEditNote;

export default notesReducer;
