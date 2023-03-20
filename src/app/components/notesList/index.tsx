import React, { ReactElement } from "react";
import { useDispatch, useSelector } from "react-redux";

import { IconButton, Paper } from "@mui/material";
import {
  DeleteOutlineOutlined as DeleteIcon,
  CreateOutlined as EditIcon,
} from "@mui/icons-material";

import { AppDispatch } from "../../store/createStore";
import {
  getIsEditNote,
  deleteNote,
  getAllNotes,
  getEditNote,
  getIsEdit,
  getSearch,
} from "../../store/notes";

import { Note } from "../../../types";

import styles from "./NotesList.module.scss";

const NotesList: React.FC = () => {
  const allNotes: Note[] = useSelector(getAllNotes());
  const isEdit: boolean = useSelector(getIsEdit());
  const isEditNote: Note | null = useSelector(getEditNote());
  const search: string = useSelector(getSearch());

  let isEditNoteArray: Note[] = [];
  let isEditNotesNoteArray: string[] = [];

  if (isEditNote) {
    isEditNotesNoteArray = isEditNote.note.replace(/\n/g, " ").split(" ");

    isEditNoteArray = [isEditNote];
  }

  const dispatch: AppDispatch = useDispatch();

  const handleDeleteNote = (index: number) => {
    dispatch(deleteNote(index));
  };

  const handleActivateIsEdit = (index: number) => {
    dispatch(getIsEditNote(index));
  };

  const filteredNotes = search
    ? allNotes.filter(
        (note) =>
          !!note.tags.filter((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          ).length
      )
    : allNotes;

  return (
    <>
      {(isEdit
        ? isEditNoteArray.length
          ? isEditNoteArray
          : filteredNotes
        : filteredNotes
      ).map((note, i) => (
        <Paper classes={{ root: styles.note_container }} key={i}>
          {isEdit ? (
            <p>
              {isEditNotesNoteArray.map((word, index) => {
                let newWord: ReactElement = <></>;

                for (let i = 0; i < isEditNote?.tags.length!; i++) {
                  const tag = isEditNote?.tags[i].toLowerCase()!;

                  if (word.toLowerCase().includes(tag)) {
                    newWord = (
                      <b key={index} className={styles.note_tagWords}>
                        {word}{" "}
                      </b>
                    );
                    return newWord;
                  } else {
                    newWord = <span key={index}>{word} </span>;
                  }
                }
                return newWord;
              })}
            </p>
          ) : (
            <p>{note.note}</p>
          )}
          <div className={styles.note_tags}>
            {note.tags.map((tag, i) => (
              <div key={i}>{tag}</div>
            ))}
          </div>

          {!isEdit && (
            <div className={styles.note_btns}>
              <IconButton onClick={() => handleActivateIsEdit(i)}>
                <EditIcon />
              </IconButton>

              <IconButton onClick={() => handleDeleteNote(i)}>
                <DeleteIcon />
              </IconButton>
            </div>
          )}
        </Paper>
      ))}
    </>
  );
};

export default NotesList;
