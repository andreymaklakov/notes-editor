import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { AppDispatch } from "./store/createStore";
import { getIsEdit, loadNotes } from "./store/notes";

import CreateNote from "./components/createNote";
import NotesList from "./components/notesList";
import SearchForm from "./components/searchForm";

function App() {
  const [myNotes, setMyNotes] = useState<string | null>();
  const [myTags, setMyTags] = useState<string | null>();

  const isEdit: boolean = useSelector(getIsEdit());

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    dispatch(loadNotes());

    const myNotes = localStorage.getItem("notes");
    const myTags = localStorage.getItem("tags");

    setMyNotes(myNotes);
    setMyTags(myTags);
  }, [dispatch]);

  if (myNotes && myTags) {
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
