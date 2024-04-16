import { Box, Typography, Card, CardContent, List, ListItem, ListItemText, ListItemIcon, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";

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
import { Formik, Field } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
const ShowQuiz = () => {
    const [quiz, setQuiz] = useState(null);
    const [candidats, setCandidats] = useState([]);
    const { id } = useParams();
  
    useEffect(() => {
      const fetchQuiz = async () => {
        try {
          const response = await axios.get(`http://192.168.1.187:5000/onequiz/${id}`);
          console.log("Response:", response.data);
          setQuiz(response.data);
        } catch (error) {
          console.error("Error fetching quiz:", error);
        }
      };

      const fetchCandidats = async () => {
        try {
            const response = await axios.get('http://192.168.1.187:5000/all_candidat');
            setCandidats(response.data);
        } catch (error) {
            console.error("Error fetching candidats:", error);
        }
    };
  
      fetchQuiz();
      fetchCandidats();

    }, [id]);

    


  const handleAffecter = async (values) => {
    try {
      await axios.post(
        "http://192.168.1.187:5000/affecter",
        {
          idcandidat: values.candidat,
          idquiz: quiz._id,
          date:values.date 

        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(" added successfully!");
      Swal.fire({
        icon: 'success',
        title: 'Test Quiz Affected Successfully!',
        showConfirmButton: false,
        timer: 1500 // Durée de l'alerte en millisecondes
      });
      
    } catch (error) {
      console.error("Error adding :", error);
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
const today = formatDate(new Date());

const validationSchema = Yup.object().shape({
    candidat: Yup.string().required("Candidat required"),
    date: Yup.date()
        .required("Date required")
        .min(today, "invalid date"),
});

const initialValues = {
  candidat: '',
  date: '',
};

  return (
    <Box m="20px">
        <Header title="AI Recruit" subtitle="Detail Quiz" />
        <Box m="40px 0 0 0" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {quiz === null ? (
                <Typography>Loading...</Typography>
            ) : (
                quiz.questions.map((question, index) => (
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
                                        <ListItemText primary={option} />
                                        {optionIndex === question.correct && (
                                            <ListItemIcon>
                                                <CheckCircleIcon color="success" />
                                            </ListItemIcon>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                ))
            )}
            
             {/* Formulaire avec Formik */}
             <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={handleAffecter}
                >
                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <Box display="flex" flexDirection="row" alignItems="center" justifyContent="center" gap={2}>
                                {/* Champ de sélection des candidats */}
                                <FormControl sx={{ width: '200px' }} error={!!touched.candidat && !!errors.candidat}>
                                    <InputLabel id="candidat-label">Candidat</InputLabel>
                                    <Field
                                        as={Select}
                                        labelId="candidat-label"
                                        id="candidat-select"
                                        name="candidat"
                                        value={values.candidat}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        label="Candidat"
                                    >
                                        {candidats.map((candidat) => (
                                            <MenuItem key={candidat._id} value={candidat._id}>
                                                {candidat.name}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                    {touched.candidat && errors.candidat && (
                                        <Typography color="error">{errors.candidat}</Typography>
                                    )}
                                </FormControl>

                                {/* Champ de sélection de la date */}
                                <TextField
                                    type="date"
                                    label="Date"
                                    value={values.date}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    name="date"
                                    error={!!touched.date && !!errors.date}
                                    helperText={touched.date && errors.date}
                                    sx={{ width: '200px' }}
                                    InputLabelProps={{ shrink: true }}
                                />

                                {/* Bouton d'affectation */}
                                <Button type="submit" variant="contained" color="primary">
                                    Affecter
                                </Button>
                            </Box>
                        </form>
                    )}
                </Formik>
            </Box>
        </Box>
);
  };




export default ShowQuiz;
