import { Box, Typography, useTheme, Card, CardContent, List, ListItem, ListItemText , ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions, TextField,Select, MenuItem,InputLabel,FormControl  } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import { Button , IconButton} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Navigate} from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Import de l'icône
import { useParams } from "react-router-dom";
import Swal from 'sweetalert2'; // Import de SweetAlert2
import { Formik, Field } from "formik";
import * as Yup from "yup";
const DetailQuiz = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [loading, setLoading] = useState(true); // Ajout de l'état de chargement
  const [questions, setQuestions] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedQuestion, setEditedQuestion] = useState('');
  const [editedOptions, setEditedOptions] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false); // Nouvelle variable d'état pour la validation du formulaire
  const [redirectToQuizs, setRedirectToQuizs] = useState(false); // Nouvelle variable d'état pour la redirection
  const { th } = useParams();

  useEffect(() => {
    fetchQuiz();
    fetchJob();
  }, []);

  const fetchQuiz = async () => {
    try {
      const response = await axios.get(`http://192.168.1.192:5000/generer_quiz/${th}`);
      console.log("Response:", response.data);
      setQuestions(response.data);
      setLoading(false); 

    } catch (error) {
      console.error("Error fetching quiz:", error);
    }
  };

  const fetchJob = async () => {
    try {
        const response = await axios.get('http://192.168.1.192:5000/alll_jobs');
        setJobs(response.data);
    } catch (error) {
        console.error("Error fetching job:", error);
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

  const saveQuiz = async (values) => {
    try {
      await axios.post(
        "http://192.168.1.192:5000/add_quiz",
        {
          // njib idrecruter min token 
          idRecruter: "65efc476236182db492bbe99",
          idjob: values.job,
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
      Swal.fire({
        icon: 'success',
        title: 'Quiz Saved Successfully!',
        showConfirmButton: false,
        timer: 1500 // Durée de l'alerte en millisecondes
      });
      setTimeout(() => {
        setRedirectToQuizs(true);
      }, 1500);
    } catch (error) {
      console.error("Error adding quiz:", error);
    }
  };

  useEffect(() => {
    // Vérifie si tous les champs sont remplis
    const isFormFilled = editedQuestion.trim() !== '' && editedOptions.every(option => option.trim() !== '');
    setIsFormValid(isFormFilled);
  }, [editedQuestion, editedOptions]);


  if (redirectToQuizs) {
    return <Navigate to="/quizs" />; 
  }
  if (loading) {
    return <Box>Loading...</Box>; 
  }

  const validationSchema = Yup.object().shape({
    job: Yup.string().required("Job required")
});
  const initialValues = {
    job: '',
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
            <Button 
              variant="outlined" 
              startIcon={<EditIcon />}  
              onClick={() => handleEditClick(index)} 
              sx={{ bgcolor: colors.greenAccent[600] }}
            >
              Edit
            </Button>
          </CardContent>
        </Card>
      ))}
    
    <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={saveQuiz}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={2}>
                                {/* Champ de sélection des candidats */}
                                <FormControl sx={{ width: '200px' }} error={!!touched.job && !!errors.job}>
                                    <InputLabel id="candidat-label">Job</InputLabel>
                                    <Field
                                        as={Select}
                                        labelId="job-label"
                                        id="job-select"
                                        name="Job"
                                        value={values.job}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Job"
                                    >
                                        {jobs.map((j) => (
                                            <MenuItem key={j._id} value={j._id}>
                                                {j.jobTitle}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                    {touched.job && errors.job && (
                                        <Typography color="error">{errors.job}</Typography>
                                    )}
                                </FormControl>

                            

                                {/* Bouton d'affectation */}
                                <Button type="submit" variant="contained" color="primary">
                                    Save
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
  
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Question</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Question"
            value={editedQuestion}
            onChange={(e) => setEditedQuestion(e.target.value)}
            margin="normal"
            error={editedQuestion.trim() === ''}
            helperText={editedQuestion.trim() === '' ? 'question required' : ''}
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
              error={option.trim() === ''}
              helperText={option.trim() === '' ? 'L\'option required' : ''}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ bgcolor: "gray" }}>Cancel</Button>
          <Button onClick={handleSaveEdit} disabled={!isFormValid} sx={{ bgcolor: colors.greenAccent[600] }}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
  
};

export default DetailQuiz;
