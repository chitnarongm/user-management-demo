"use client";

import { UserData } from "@/typings/model";
import EditIcon from "@mui/icons-material/Edit";
import { IconButton } from "@mui/material";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { FunctionComponent, useState } from "react";
import UserActionDialog from "../UserActionDialog";

export const UserActionIconRenderer: FunctionComponent<GridRenderCellParams<UserData>> = ({ id, field, row }) => {
  const [isShowEditDialog, setIsShowEditDialog] = useState(false);
  const openEditDialog = () => {
    setIsShowEditDialog(true);
  };

  const closeEditDialog = () => {
    setIsShowEditDialog(false);
  };

  return (
    <>
      <IconButton data-testid={`edit-icon-${field}-${id}`} onClick={openEditDialog}>
        <EditIcon />
      </IconButton>
      <UserActionDialog
        isOpen={isShowEditDialog}
        onClose={closeEditDialog}
        userData={row}
        dialogTitle="Edit User"
        confirmButtonText="Update"
        mode="edit"
        isDeleteAllowed
      />
    </>
  );
};

export default UserActionIconRenderer;
