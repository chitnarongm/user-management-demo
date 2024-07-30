"use client";
import {
  getUsers,
  selectLoading,
  selectTotalUsers,
  selectUserError,
  selectUsers,
  selectUsersOffset,
} from "@/lib/features/users/userSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { UserData } from "@/typings/model";
import { ROLES } from "@/utils/constants";
import AddUserIcon from "@mui/icons-material/PersonAdd";
import { Box, Button, Grid, Paper, TablePagination } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FunctionComponent, MouseEvent, useEffect, useState } from "react";
import Loading from "../components/Loading";
import { openToast } from "../components/Toast";
import UserActionDialog from "../components/users/UserActionDialog";
import UserActionIconRenderer from "../components/users/UserActionIconRenderer";

const columnDefs: GridColDef<UserData>[] = [
  {
    field: "name",
    headerName: "Name",
    headerAlign: "center",
    flex: 1,
  },
  {
    field: "email",
    headerName: "Email",
    headerAlign: "center",
    flex: 1,
  },
  {
    field: "role",
    headerName: "Role",
    headerAlign: "center",
    valueFormatter: (role: string) => ROLES[role],
    flex: 1,
  },
  {
    field: "action",
    headerName: "Action",
    headerAlign: "center",
    renderCell: UserActionIconRenderer,
  },
];

const UserManagement: FunctionComponent = () => {
  const users = useAppSelector(selectUsers);
  const total = useAppSelector(selectTotalUsers);
  const offset = useAppSelector(selectUsersOffset);
  const error = useAppSelector(selectUserError);
  const isLoading = useAppSelector(selectLoading);
  const dispatch = useAppDispatch();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  const getCurrentPage = () => {
    return Math.floor(offset / 10);
  };

  const handlePageChange = (event: MouseEvent<HTMLButtonElement> | null, selectedPage: number) => {
    const currentOffset = 10 * selectedPage;
    dispatch(getUsers(currentOffset));
  };

  useEffect(() => {
    dispatch(getUsers(0));
  }, []);

  useEffect(() => {
    if (error) {
      openToast(JSON.stringify(error?.message));
    }
  }, [error]);

  return (
    <>
      {isLoading && <Loading />}
      <Grid container padding="24px" display="flex" justifyContent="center" marginTop="120px">
        <Grid item xs={8} display="flex" justifyContent="flex-end">
          <Button
            data-testid="create-user-button"
            size="large"
            variant="contained"
            startIcon={<AddUserIcon />}
            onClick={openCreateDialog}
          >
            Create New User
          </Button>
        </Grid>
        <Grid item xs={8}>
          <Paper
            elevation={8}
            sx={{
              width: "100%",
              marginTop: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "24px",
            }}
          >
            <Box width="100%">
              <DataGrid
                data-testid="user-data-table"
                rows={users}
                columns={columnDefs}
                isRowSelectable={() => false}
                hideFooter
                pageSizeOptions={[10]}
                disableColumnSorting
                disableColumnMenu
                disableVirtualization
                autoHeight
                slotProps={{
                  row: { role: "user-data-table-row" },
                  // @ts-ignore
                  noRowsOverlay: { "data-testid": "no-user-data" },
                }}
              />
            </Box>
            <TablePagination
              data-testid="user-data-table-pagination"
              sx={{ marginTop: "16px" }}
              component="div"
              count={total}
              page={getCurrentPage()}
              rowsPerPageOptions={[]}
              rowsPerPage={10}
              onPageChange={handlePageChange}
              showFirstButton
              showLastButton
            />
          </Paper>
        </Grid>
        <UserActionDialog
          isOpen={isCreateDialogOpen}
          onClose={closeCreateDialog}
          dialogTitle="Create New User"
          confirmButtonText="Create"
        />
      </Grid>
    </>
  );
};

export default UserManagement;
