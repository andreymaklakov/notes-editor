import React, { ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";

import { Paper, TextField } from "@mui/material";

import { AppDispatch } from "../../store/createStore";
import { changeSearchField, getSearch } from "../../store/notes";

import styles from "./SearchForm.module.scss";

const SearchForm = () => {
  const search: string = useSelector(getSearch());

  const dispatch: AppDispatch = useDispatch();

  const handleChangeSearchField = ({
    target,
  }: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (target) {
      dispatch(changeSearchField(target.value));
    }
  };

  return (
    <Paper className={styles.form_container}>
      <form>
        <TextField
          label="Find note by Tag"
          placeholder="Enter Tag...."
          variant="outlined"
          value={search}
          onChange={handleChangeSearchField}
          fullWidth
        />
      </form>
    </Paper>
  );
};

export default SearchForm;
