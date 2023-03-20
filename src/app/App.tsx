import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "./store/createStore";
import { getAllNotes, getAllTags, getIsEdit, loadNotes } from "./store/notes";

import CreateNote from "./components/createNote";
import NotesList from "./components/notesList";
import SearchForm from "./components/searchForm";

import { Note } from "../types";

function App() {
  const isEdit: boolean = useSelector(getIsEdit());
  const allNotes: Note[] = useSelector(getAllNotes());
  const allTags: string[] = useSelector(getAllTags());

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(loadNotes());
  }, [dispatch]);

  if (allNotes.length && allTags.length) {
    return (
      <div className="app">
        <CreateNote />

        {!isEdit && <SearchForm />}

        <NotesList />
      </div>
    );
  }
  return <p>loading...</p>;
}

export default App;
