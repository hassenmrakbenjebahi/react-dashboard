import { Box, Typography, useTheme, Card, CardContent, List, ListItem, ListItemText , ListItemIcon } from "@mui/material";
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
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import de l'icône
import { useParams } from "react-router-dom";

const ModifierQuiz = () => {
  const [quiz, setquiz] = useState([]);
  const { id } = useParams();


  useEffect(() => {
    fetchQuiz();
   

  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`http://192.168.1.5:5000/onequiz/${id}`);
      console.log("Response:", response.data); // Log the response data
      setquiz(response.data); // Set the state with response data

    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };
  
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <div>
      {quiz && (
        quiz.questions.map((question, index) => (
          <Card key={index} sx={{ marginTop: 2 }}>
            <CardContent>
              <Typography variant="h5">{question.question}</Typography>
              <ul>
                {question.options.map((option, i) => (
                  <li key={i}>{option}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );

};




export default ModifierQuiz;
