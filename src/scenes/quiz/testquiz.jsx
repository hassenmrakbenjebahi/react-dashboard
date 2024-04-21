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
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import PageviewIcon from '@mui/icons-material/Info';
import Swal from 'sweetalert2';


const TestQuiz = () => {
  const [testquizs, setTestQuizs] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchTestQuizs = async () => {
        try {
          const response = await axios.get(`http://192.168.1.187:5000/testQuizByRecruter/661e2edf36e2c6c7a2422722`);
          console.log("Response:", response.data); // Log the response data
          setTestQuizs(response.data); // Set the state with response data
        } catch (error) {
          console.error("Error fetching testquizs:", error);
        }
      };
    fetchTestQuizs();
  }, []);



  const fetchQuiz = async (idquiz) => {
    try {
      const response = await axios.get(`http://192.168.1.187:5000/onequiz/${idquiz}`);
      console.log("quiz:", response.data);
      return response.data.theme;
    } catch (error) {
      console.error("Error fetching quiz:", error);
      return null;
    }
  };

  const fetchCandidat = async (idcandidat) => {
    try {
      const response = await axios.get(`http://192.168.1.187:5000/onecandidat/${idcandidat}`);
      console.log("candidat:", response.data);
      return response.data.name;
    } catch (error) {
      console.error("Error fetching candidat:", error);
      return null;

    }
  };

     // Create table data
     useEffect(() => {
        const createTableData = async () => {
            const newTableData = [];
            for (const testquiz of testquizs) {
                const idTestQuiz = testquiz._id;
                const date = testquiz.date;
                const score = testquiz.score;
                const status = testquiz.status;

                // Fetch candidate name and quiz theme
                const nomCandidat = await fetchCandidat(testquiz.idCandidat);
                const themeQuiz = await fetchQuiz(testquiz.idQuiz);

                // Create the new table row
                newTableData.push({
                    _id: idTestQuiz,
                    nom_candidat: nomCandidat,
                    theme_quiz: themeQuiz,
                    date: date,
                    score: score,
                    status: status
                });
            }
            // Set the table data
            setTableData(newTableData);
        };

        createTableData();
    }, [testquizs]);

  
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "nom_candidat", headerName: "candidat", flex: 1 },
    { field: "theme_quiz", headerName: "theme quiz", flex: 1 },
    { field: "date", headerName: "date", flex: 1 },
    { field: "score", headerName: "score", flex: 1 },
    { field: "status", headerName: "statut", flex: 1 }
  ];
  

  return (
    <Box m="20px">
      <Header title="AI Recruit" subtitle="Managing the Quiz" />
      <Box m="20px">
      
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
        <DataGrid checkboxSelection rows={tableData} columns={columns} getRowId={(row) => row._id} />
      </Box>
    </Box>
  );
};

export default TestQuiz;
