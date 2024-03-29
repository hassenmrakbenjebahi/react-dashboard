import React, { useState, useEffect } from "react";
import { Box, Typography, Button, useTheme, Dialog, DialogTitle, DialogContent, TextField, DialogActions } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import axios from "axios";
import Header from "../../components/Header";

const JobsManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [jobs, setJobs] = useState([]);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [newJob, setNewJob] = useState({
    jobTitle: "",
    description: "",
    company_information: "",
    location: "",
    employment_type: "",
    salary_compensation: ""
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const response = await axios.get("http://172.16.3.129:10000/jobs");
    const jobsWithId = response.data.map((job, index) => ({ ...job, id: index })); // Changed to use index for id
    setJobs(jobsWithId);
  };

  const handleDelete = async (id) => {
    const jobId = jobs[id]._id; // Access the original _id using the index
    await axios.delete(`http://172.16.3.129:10000/jobs/${jobId}`);
    fetchJobs(); // Refresh the list after deletion
  };

  const handleEditSave = async () => {
    if (selectedJob) {
      await axios.put(`http://172.16.3.129:10000/jobs/${selectedJob._id}`, selectedJob);
      fetchJobs(); // Refresh the list
      setIsEditDialogOpen(false); // Close the dialog
    }
  };

  const handleCreateSave = async () => {
    await axios.post("http://172.16.3.129:10000/jobs", newJob);
    fetchJobs(); // Refresh the list
    setIsCreateDialogOpen(false); // Close the dialog
  };

  const columns = [
    // Removed the ID column to not display it
    { field: "jobTitle", headerName: "Title", flex: 1 },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "company_information", headerName: "Company Info", flex: 1 },
    { field: "location", headerName: "Location", flex: 1 },
    { field: "employment_type", headerName: "Employment Type", flex: 1 },
    { field: "salary_compensation", headerName: "Salary", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Button
              startIcon={<EditOutlinedIcon />}
              onClick={() => {
                setSelectedJob(jobs.find(job => job.id === params.id));
                setIsEditDialogOpen(true);
              }}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteOutlineOutlinedIcon />}
              onClick={() => handleDelete(params.id)}
              color="error"
            >
              Delete
            </Button>
          </>
        );
      },
      flex: 1,
    },
  ];

  return (
    <Box m="20px">
      <Header title="Job Management" subtitle="Here you can manage your job offers" />
      <Box m="20px">
        <Button
          variant="contained"
          startIcon={<AddOutlinedIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
        >
          Add Job
        </Button>
      </Box>
      <Box
        m="40px 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
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
        }}
      >
        <DataGrid
          checkboxSelection
          rows={jobs}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          disableSelectionOnClick
        />
      </Box>
      <Dialog open={isEditDialogOpen} onClose={() => setIsEditDialogOpen(false)}>
        <DialogTitle>Edit Job</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="jobTitle"
            label="Job Title"
            type="text"
            fullWidth
            variant="standard"
            value={selectedJob ? selectedJob.jobTitle : ""}
            onChange={(e) => setSelectedJob({ ...selectedJob, jobTitle: e.target.value })}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={selectedJob ? selectedJob.description : ""}
            onChange={(e) => setSelectedJob({ ...selectedJob, description: e.target.value })}
          />
          <TextField
            margin="dense"
            id="company_information"
            label="Company Information"
            type="text"
            fullWidth
            variant="standard"
            value={selectedJob ? selectedJob.company_information : ""}
            onChange={(e) => setSelectedJob({ ...selectedJob, company_information: e.target.value })}
          />
          <TextField
            margin="dense"
            id="location"
            label="Location"
            type="text"
            fullWidth
            variant="standard"
            value={selectedJob ? selectedJob.location : ""}
            onChange={(e) => setSelectedJob({ ...selectedJob, location: e.target.value })}
          />
          <TextField
            margin="dense"
            id="employment_type"
            label="Employment Type"
            type="text"
            fullWidth
            variant="standard"
            value={selectedJob ? selectedJob.employment_type : ""}
            onChange={(e) => setSelectedJob({ ...selectedJob, employment_type: e.target.value })}
          />
          <TextField
            margin="dense"
            id="salary_compensation"
            label="Salary"
            type="text"
            fullWidth
            variant="standard"
            value={selectedJob ? selectedJob.salary_compensation : ""}
            onChange={(e) => setSelectedJob({ ...selectedJob, salary_compensation: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleEditSave}>Save</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={isCreateDialogOpen} onClose={() => setIsCreateDialogOpen(false)}>
        <DialogTitle>Create New Job</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            id="jobTitle"
            label="Job Title"
            type="text"
            fullWidth
            variant="standard"
            value={newJob.jobTitle}
            onChange={(e) => setNewJob({ ...newJob, jobTitle: e.target.value })}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={newJob.description}
            onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
          />
          <TextField
            margin="dense"
            id="company_information"
            label="Company Information"
            type="text"
            fullWidth
            variant="standard"
            value={newJob.company_information}
            onChange={(e) => setNewJob({ ...newJob, company_information: e.target.value })}
          />
          <TextField
            margin="dense"
            id="location"
            label="Location"
            type="text"
            fullWidth
            variant="standard"
            value={newJob.location}
            onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
          />
          <TextField
            margin="dense"
            id="employment_type"
            label="Employment Type"
            type="text"
            fullWidth
            variant="standard"
            value={newJob.employment_type}
            onChange={(e) => setNewJob({ ...newJob, employment_type: e.target.value })}
          />
          <TextField
            margin="dense"
            id="salary_compensation"
            label="Salary"
            type="text"
            fullWidth
            variant="standard"
            value={newJob.salary_compensation}
            onChange={(e) => setNewJob({ ...newJob, salary_compensation: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleCreateSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JobsManagement;
