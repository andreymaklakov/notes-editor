import React, { ChangeEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Button,
  Checkbox,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";

import { AppDispatch } from "../../store/createStore";
import {
  addNote,
  changeNotesField,
  changeSelectedTags,
  changeNewTags,
  changeIsEditNote,
  changeIsEditNoteSelectedTags,
  getAllTags,
  getNewTags,
  getNote,
  getTags,
  getIsEdit,
  getEditNote,
} from "../../store/notes";

import { Note } from "../../../types";

import styles from "./CreateNote.module.scss";

const CreateNote: React.FC = () => {
  const note: string = useSelector(getNote());
  const tags: string[] = useSelector(getTags());
  const allTags: string[] = useSelector(getAllTags());
  const newTags: string = useSelector(getNewTags());
  const isEdit: boolean = useSelector(getIsEdit());
  const isEditNote: Note | null = useSelector(getEditNote());

  const dispatch: AppDispatch = useDispatch();

  const handleSelectTags = (event: SelectChangeEvent<typeof tags>) => {
    const {
      target: { value },
    } = event;

    if (isEdit) {
      dispatch(
        changeIsEditNoteSelectedTags(
          typeof value === "string" ? value.split(",") : value
        )
      );

      return;
    }
    dispatch(
      changeSelectedTags(typeof value === "string" ? value.split(",") : value)
    );
  };

  const handleChangeNoteField = ({
    target,
  }: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (target) {
      if (isEdit) {
        dispatch(changeIsEditNote(target.value));

        return;
      }
      dispatch(changeNotesField(target.value));
    }
  };

  const handleChangeTagsField = ({
    target,
  }: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (target) {
      dispatch(changeNewTags(target.value));
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    dispatch(addNote());
  };

  return (
    <Paper>
      <form className={styles.note_form} onSubmit={handleSubmit}>
        <TextField
          classes={{ root: styles.note_field }}
          label="Note"
          multiline
          value={isEdit ? isEditNote?.note : note}
          minRows={4}
          placeholder="Enter your note"
          onChange={handleChangeNoteField}
        />

        <InputLabel>Select Tags</InputLabel>
        <Select
          value={isEdit ? isEditNote?.tags : tags}
          onChange={handleSelectTags}
          multiple
          renderValue={(selected) => selected.join(", ")}
        >
          {allTags.map((tag, i) => (
            <MenuItem key={i} value={tag}>
              <Checkbox
                checked={(isEdit ? isEditNote?.tags! : tags).indexOf(tag) > -1}
              />
              <ListItemText primary={tag} />
            </MenuItem>
          ))}
        </Select>

        <TextField
          label="Add new tags"
          value={newTags}
          placeholder="Add new tags"
          multiline
          onChange={handleChangeTagsField}
        />

        <Button
          disabled={isEdit ? !isEditNote?.note : !note}
          variant="contained"
          type="submit"
        >
          {isEdit ? "Change note" : "Add note"}
        </Button>
      </form>
    </Paper>
  );
};

export default CreateNote;
