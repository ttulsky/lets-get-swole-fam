import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Modal,
  Box,
  Avatar,
} from "@mui/material";
import { storage, firestore } from "../../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import AuthContext from "../../authContext";
import EditProfile from "./edit-profile";
import { useTheme } from "@mui/material/styles";
import "./profile.css";

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [editOpen, setEditOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files[0] && currentUser) {
      const file = e.target.files[0];
      const fileRef = ref(storage, `profileImages/${currentUser.uid}`);
      try {
        await uploadBytes(fileRef, file);
        const fileURL = await getDownloadURL(fileRef);
        await updateDoc(doc(firestore, "users", currentUser.uid), {
          profileImageURL: fileURL,
        });
        fetchUserData();
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
    }
  };

  const handleEditOpen = () => setEditOpen(true);
  const handleEditClose = () => setEditOpen(false);

  return (
    <Container component="main" maxWidth="md">
      <Paper className="profile-paper" elevation={3}>
        <div className="profile-header">
          <Typography variant="h4" component="h1">
            My Profile
          </Typography>
          <div className="profile-image-container">
            <label htmlFor="profile-upload">
              <input
                id="profile-upload"
                type="file"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <div className="profile-image">
                {userData.profileImageURL ? (
                  <Avatar
                    src={userData.profileImageURL}
                    alt="Profile"
                    sx={{ width: 80, height: 80 }}
                  />
                ) : (
                  userData.name?.charAt(0)
                )}
                <span className="edit-label">Edit Profile Photo</span>
              </div>
            </label>
          </div>
        </div>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Name:</Typography>
            <Typography variant="body1">{userData.name}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Email:</Typography>
            <Typography variant="body1">{userData.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Age:</Typography>
            <Typography variant="body1">{userData.age}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Height:</Typography>
            <Typography variant="body1">{userData.height} cm</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Weight:</Typography>
            <Typography variant="body1">{userData.weight} kg</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6">Sex:</Typography>
            <Typography variant="body1">{userData.sex}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Fitness Goal:</Typography>
            <Typography variant="body1">{userData.fitnessGoal}</Typography>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          color="primary"
          onClick={handleEditOpen}
          sx={{ mt: 2 }}
        >
          Edit Profile
        </Button>
      </Paper>

      <Modal open={editOpen} onClose={handleEditClose}>
        <EditProfile onClose={handleEditClose} />
      </Modal>
    </Container>
  );
};

export default Profile;
