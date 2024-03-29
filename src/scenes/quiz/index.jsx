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

const Quiz = () => {
  const [quizs, setquizs] = useState([]);

  useEffect(() => {
    const fetchQuizs = async () => {
      try {
        const response = await axios.get("http://192.168.1.5:5000/all_quiz");
        console.log("Response:", response.data); // Log the response data
        setquizs(response.data); // Set the state with response data
      } catch (error) {
        console.error("Error fetching quizs:", error);
      }
    };

    fetchQuizs();
  }, []);


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
      { field: "_id", headerName: "ID",   flex: 1, },
      { field: "theme", headerName: "THEME" ,  flex: 1,},
  ];

  return (
    <Box m="20px">
      <Header title="AI Recruit" subtitle="Managing the Quiz" />
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
