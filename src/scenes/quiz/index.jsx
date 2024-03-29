import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataRecruitment } from "../../data/mockDataApplications";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button , IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Link } from 'react-router-dom';


const Quiz = () => {
  const [quizs, setquizs] = useState([]);

  useEffect(() => {
    fetchQuizs();
  }, []);

  const fetchQuizs = async () => {
    try {
      const response = await axios.get("http://192.168.1.5:5000/all_quiz");
      console.log("Response:", response.data); // Log the response data
      setquizs(response.data); // Set the state with response data
    } catch (error) {
      console.error("Error fetching quizs:", error);
    }
  };

  const handleEdit = (id) => {
    // Logique de modification
    console.log("Modifier le quiz avec l'ID :", id);
  };
  
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://192.168.1.5:5000/delete_quiz/${id}`);
      // Re-fetch quizs after deletion
      fetchQuizs();
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "theme", headerName: "THEME", flex: 1 },
    {
      field: "edit",
      headerName: "EDIT",
      flex: 1,
      renderCell: ({ row }) => (
        <IconButton onClick={() => handleEdit(row._id)}>
          <EditIcon />
        </IconButton>
      ),
    },
    {
      field: "delete",
      headerName: "DELETE",
      flex: 1,
      renderCell: ({ row }) => (
        <IconButton onClick={() => handleDelete(row._id)}>
          <DeleteIcon />
        </IconButton>
      ),
    },
  ];
  

  return (
    <Box m="20px">
      <Header title="AI Recruit" subtitle="Managing the Quiz" />
      <Box m="20px">
        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          component={Link} to="/formQuiz"
        >
          Add Quiz
        </Button>
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <DataGrid checkboxSelection rows={quizs} columns={columns} getRowId={(row) => row._id} />
      </Box>
    </Box>
  );
};

export default Quiz ;
