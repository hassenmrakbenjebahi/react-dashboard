import { Box, Typography, useTheme, Card, CardContent, List, ListItem, ListItemText } from "@mui/material";
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

const DetailQuiz = () => {
  const [quizs, setquizs] = useState([]);

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get("http://192.168.1.5:5000/quiz");
      console.log("Response:", response.data); // Log the response data
      setquizs(response.data); // Set the state with response data
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
 
  return (
    <Box m="20px">
      <Header title="AI Recruit" subtitle="Detail Quiz" />
     
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        {quizs.map((quiz, index) => (
          <Card key={index} sx={{ width: '80%', mb: 2 }}>
            <CardContent>
              <Typography variant="h6" component="div" mb={1}>
                Question {index + 1}:
              </Typography>
              <Typography variant="body1" component="div" mb={2}>
                {quiz.question}
              </Typography>
              <List>
                {quiz.options.map((option, optionIndex) => (
                  <ListItem key={optionIndex} disablePadding>
                    <ListItemText primary={option} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default DetailQuiz;
