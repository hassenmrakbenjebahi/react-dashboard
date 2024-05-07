import { Box, Typography, useTheme,Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useEffect, useState } from "react";
import axios from "axios";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Swal from 'sweetalert2';

const TestQuiz = () => {
  const [testquizs, setTestQuizs] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
 
    fetchTestQuizs();
  }, []);

  const fetchTestQuizs = async () => {
    try {
      const response = await axios.get(`http://192.168.178.122:5000/testQuizByRecruter/661e2edf36e2c6c7a2422722`);
      console.log("Response:", response.data);
      setTestQuizs(response.data);
    } catch (error) {
      console.error("Error fetching testquizs:", error);
    }
  };

  const fetchQuiz = async (idquiz) => {
    try {
      const response = await axios.get(`http://192.168.178.122:5000/onequiz/${idquiz}`);
      console.log("quiz:", response.data);
      return response.data.theme;
    } catch (error) {
      console.error("Error fetching quiz:", error);
      return null;
    }
  };

  const fetchCandidat = async (idcandidat) => {
    try {
      const response = await axios.get(`http://192.168.178.122:5000/onecandidat/${idcandidat}`);
      console.log("candidat:", response.data);
      return response.data.name;
    } catch (error) {
      console.error("Error fetching candidat:", error);
      return null;
    }
  };

  const handleDelete = async (id) => {
    try {
      // Afficher une alerte de confirmation avant la suppression
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: 'You will not be able to recover this test quiz!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      });
  
      // Si l'utilisateur clique sur "Oui"
      if (result.isConfirmed) {
        await axios.delete(`http://192.168.178.122:5000/delete_test_quiz/${id}`);
        // Afficher une alerte de suppression réussie
        Swal.fire('Deleted!', 'test quiz has been deleted.', 'success');
        // Re-fetch quizs after deletion
        fetchTestQuizs();
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
    }
  };

  useEffect(() => {
    const createTableData = async () => {
      const newTableData = [];
      for (const testquiz of testquizs) {
        const idTestQuiz = testquiz._id;
        const date = testquiz.date;
        const score = testquiz.score;
        const status = testquiz.status;

        const nomCandidat = await fetchCandidat(testquiz.idCandidat);
        const themeQuiz = await fetchQuiz(testquiz.idQuiz);

        newTableData.push({
          _id: idTestQuiz,
          nom_candidat: nomCandidat,
          theme_quiz: themeQuiz,
          date: date,
          score: score,
          status: status
        });
      }
      setTableData(newTableData);
    };

    createTableData();
  }, [testquizs]);

  const determineScoreTextColor = (score) => {
    if (score <= 50) return 'red';
    else if (score > 50 && score <= 70) return 'orange';
    else return 'green';
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "nom_candidat", headerName: "candidat", flex: 1 },
    { field: "theme_quiz", headerName: "theme quiz", flex: 1 },
    { field: "date", headerName: "date", flex: 1 },
    { 
      field: "score", 
      headerName: "score", 
      flex: 1, 
      renderCell: (params) => {
        console.log("Score:", params.value); // Vérifier la valeur du score
        console.log("Color:", determineScoreTextColor(params.value)); // Vérifier la couleur du score
        return (
          <div sx={{ color: determineScoreTextColor(params.value) }}>
            {params.value} %
          </div>
        );
      }
      
    },
    {
      field: "delete",
      headerName: "DELETE",
      flex: 1,
      renderCell: ({ row }) => (
        <Button startIcon={<DeleteOutlineOutlinedIcon />}  onClick={() => handleDelete(row._id)}
        color="error"
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="AI Recruit" subtitle="Managing  test Quizs" />
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
        <DataGrid 
          checkboxSelection 
          rows={tableData} 
          columns={columns} 
          getRowId={(row) => row._id} 
        />
      </Box>
    </Box>
  );
};

export default TestQuiz;
