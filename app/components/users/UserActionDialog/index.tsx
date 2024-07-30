"use client";
import { createUser, deleteUser, editUser, getUsers, selectUsersOffset } from "@/lib/features/users/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { UserData } from "@/typings/model";
import { ROLES } from "@/utils/constants";
import { EMAIL_REGEX } from "@/utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { FunctionComponent, useEffect } from "react";
import { Controller, ControllerRenderProps, FormProvider, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import * as yup from "yup";
import { openToast } from "../../Toast";

export interface UserActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  dialogTitle: string;
  confirmButtonText: string;
  mode?: "create" | "edit";
  userData?: UserData;
  isDeleteAllowed?: boolean;
}

const createUserSchema = yup.object<UserData>().shape({
  id: yup.string().required(),
  name: yup.string().required(),
  email: yup.string().required().matches(EMAIL_REGEX, "Invalid Email Format."),
  role: yup.string().required(),
});

const initialCreateUserForm: UserData = {
  id: uuidv4(),
  name: "",
  email: "",
  role: "",
};

const UserActionDialog: FunctionComponent<UserActionDialogProps> = ({
  isOpen,
  onClose,
  mode = "create",
  userData,
  dialogTitle,
  confirmButtonText,
  isDeleteAllowed = false,
}) => {
  const formMethods = useForm<UserData>({
    reValidateMode: "onSubmit",
    defaultValues: initialCreateUserForm,
    resolver: yupResolver(createUserSchema),
  });

  const dispatch = useAppDispatch();
  const offset = useAppSelector(selectUsersOffset);

  const { handleSubmit, control, unregister, reset } = formMethods;

  const handleDialogClose = () => {
    unregister("name");
    unregister("email");
    unregister("role");

    onClose();
  };

  const handleSubmitAction = async (user: UserData) => {
    switch (mode) {
      case "create":
        const createdResult = await dispatch(createUser(user));
        if (createdResult.meta.requestStatus === "fulfilled") {
          dispatch(getUsers(0));
          onClose();
        } else if (createdResult.meta.requestStatus === "rejected") {
          openToast("Create User Failed.");
        }
        break;
      case "edit":
        const editedResult = await dispatch(editUser(user));
        if (editedResult.meta.requestStatus === "fulfilled") {
          dispatch(getUsers(offset));
          onClose();
        } else if (editedResult.meta.requestStatus === "rejected") {
          openToast("Edit User Failed.");
        }
        break;
    }
  };

  const handleDeleteUser = async () => {
    if (userData) {
      const deletedResult = await dispatch(deleteUser(userData.id));
      if (deletedResult.meta.requestStatus === "fulfilled") {
        dispatch(getUsers(offset));
        onClose();
      } else if (deletedResult.meta.requestStatus === "rejected") {
        openToast("Delete User Failed.");
      }
    }
  };

  const handleRoleChange = (event: SelectChangeEvent<any>, field: ControllerRenderProps<UserData, "role">) => {
    field.onChange(event);
  };

  const prefillValue = () => {
    if (userData) {
      reset({
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      });
    } else {
      reset(initialCreateUserForm);
    }
  };

  useEffect(() => {
    prefillValue();
  }, [isOpen]);

  return (
    <Dialog data-testid={`user-${mode}-dialog`} open={isOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <FormProvider {...formMethods}>
        <form onSubmit={handleSubmit(handleSubmitAction)}>
          <DialogTitle data-testid={`user-${mode}-title`} display="flex" justifyContent="space-between">
            {dialogTitle}
            <IconButton data-testid={`user-${mode}-close-button`} onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl margin="dense" fullWidth variant="outlined">
                  <InputLabel data-testid={`user-${mode}-name-label`} htmlFor="outlined-adornment-name">
                    Name
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-name"
                    label="Name"
                    inputProps={{
                      ...field,
                      "data-testid": `user-${mode}-name-input`,
                    }}
                  />
                  <FormHelperText data-testid={`user-${mode}-name-error`} error={Boolean(error?.message)}>
                    {error?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name="email"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl margin="dense" fullWidth variant="outlined">
                  <InputLabel data-testid={`user-${mode}-email-label`} htmlFor="outlined-adornment-email">
                    Email
                  </InputLabel>
                  <OutlinedInput
                    id="outlined-adornment-email"
                    label="Email"
                    inputProps={{
                      ...field,
                      "data-testid": `user-${mode}-email-input`,
                    }}
                  />
                  <FormHelperText data-testid={`user-${mode}-email-error`} error={Boolean(error?.message)}>
                    {error?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
            <Controller
              name="role"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <FormControl margin="dense" fullWidth variant="outlined">
                  <InputLabel data-testid={`user-${mode}-role-label`} id="demo-simple-select-label">
                    Role
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Role"
                    onChange={(event) => handleRoleChange(event, field)}
                    // @ts-ignore
                    SelectDisplayProps={{ "data-testid": `user-${mode}-role-select` }}
                    inputProps={{
                      ...field,
                      "data-testid": `user-${mode}-role-input`,
                    }}
                  >
                    {Object.entries(ROLES).map(([value, displayValue], index) => (
                      <MenuItem
                        role={`user-${mode}-role-select-item`}
                        data-testid={`user-${mode}-role-select-item-${index}`}
                        key={value}
                        value={value}
                      >
                        {displayValue}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText data-testid={`user-${mode}-role-error`} error={Boolean(error?.message)}>
                    {error?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </DialogContent>
          <DialogActions>
            {isDeleteAllowed && (
              <Button
                data-testid={`user-${mode}-delete-button`}
                variant="contained"
                color="error"
                onClick={handleDeleteUser}
              >
                Delete
              </Button>
            )}
            <Button data-testid={`user-${mode}-confirm-button`} variant="contained" type="submit">
              {confirmButtonText}
            </Button>
          </DialogActions>
        </form>
      </FormProvider>
    </Dialog>
  );
};

export default UserActionDialog;
