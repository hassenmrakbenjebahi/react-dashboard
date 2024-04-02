import { Box, Typography, useTheme, Card, CardContent, List, ListItem, ListItemText , ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions, TextField  } from "@mui/material";
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

const DetailQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedOptions, setEditedOptions] = useState([]);
  const { th } = useParams();

  useEffect(() => {
    fetchQuiz();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get("http://192.168.1.4:5000/quiz");
      console.log("Response:", response.data);
      setQuestions(response.data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  const handleEditClick = (questionIndex) => {
    setSelectedQuestion(questionIndex);
    setEditedQuestion(questions[questionIndex].question);
    setEditedOptions([...questions[questionIndex].options]);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    const updatedQuestions = [...questions];
    updatedQuestions[selectedQuestion] = {
      ...updatedQuestions[selectedQuestion],
      question: editedQuestion,
      options: editedOptions
    };
    setQuestions(updatedQuestions);
    setEditDialogOpen(false);
  };

  const saveQuiz = async () => {
    try {
      await axios.post(
        "http://192.168.1.4:5000/add_quiz",
        {
          theme: th,
          questions: questions,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log("Quiz added successfully!");
    } catch (error) {
      console.error("Error adding quiz:", error);
    }
  };

  return (
    <Box m="20px">
      {questions.map((question, index) => (
        <Card key={index} sx={{ width: '80%', mb: 3 }}>
          <CardContent>
            <Typography variant="h6" component="div" mb={1}>
              Question {index + 1}:
            </Typography>
            <Typography variant="body1" component="div" mb={2}>
              {question.question}
            </Typography>
            <List>
              {question.options.map((option, optionIndex) => (
                <ListItem key={optionIndex} disablePadding>
                  <ListItemText primary={option}/>
                  {optionIndex === question.correct && (
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                  )}
                </ListItem>
              ))}
            </List>
            <Button variant="outlined" startIcon={<EditIcon />} onClick={() => handleEditClick(index)}>Modifier</Button>
          </CardContent>
        </Card>
      ))}

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Modifier la question</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Question"
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
            margin="normal"
          />
          {editedOptions.map((option, index) => (
            <TextField
              key={index}
              fullWidth
              label={`Option ${index + 1}`}
              value={option}
              onChange={(e) => {
                const updatedOptions = [...editedOptions];
                updatedOptions[index] = e.target.value;
                setEditedOptions(updatedOptions);
              }}
              margin="normal"
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Annuler</Button>
          <Button onClick={handleSaveEdit}>Sauvegarder</Button>
        </DialogActions>
      </Dialog>

      {/* Bouton "Sauvegarder" */}
      <Box textAlign="center">
        <Button variant="contained" onClick={saveQuiz}>Sauvegarder le Quiz</Button>
      </Box>
    </Box>
  );
};

export default DetailQuiz;
