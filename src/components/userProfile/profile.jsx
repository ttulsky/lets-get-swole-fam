import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Button,
  Container,
  Grid,
  Paper,
  Modal,
  Avatar,
} from "@mui/material";
import { storage, firestore } from "../../firebase-config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import AuthContext from "../../authContext";
import EditProfile from "./edit-profile";
import { useTheme } from "@mui/material/styles";
import "./profile.css"; // Ensure this import is here

const Profile = () => {
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [workoutLogsCount, setWorkoutLogsCount] = useState(0);
  const [mealLogsCount, setMealLogsCount] = useState(0);
  const [meditationLogsCount, setMeditationLogsCount] = useState(0);
  const [editOpen, setEditOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
      fetchLogsCount();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      const userDoc = await getDoc(doc(firestore, "users", currentUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        console.error("User data not found!");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const fetchLogsCount = async () => {
    try {
      if (!currentUser) {
        console.error("Current user is not available");
        return;
      }
      console.log("Fetching logs count for user:", currentUser.uid);

      const workoutLogsQuery = query(
        collection(firestore, `users/${currentUser.uid}/workoutLogs`),
        where("userId", "==", currentUser.uid)
      );
      const mealLogsQuery = query(
        collection(firestore, `users/${currentUser.uid}/mealLogs`),
        where("userId", "==", currentUser.uid)
      );
      const meditationLogsQuery = query(
        collection(firestore, `users/${currentUser.uid}/meditationLogs`),
        where("userId", "==", currentUser.uid)
      );

      const workoutLogsSnapshot = await getDocs(workoutLogsQuery);
      const mealLogsSnapshot = await getDocs(mealLogsQuery);
      const meditationLogsSnapshot = await getDocs(meditationLogsQuery);

      console.log("Workout Logs Snapshot:", workoutLogsSnapshot.docs);
      console.log(
        "Workout Logs Data:",
        workoutLogsSnapshot.docs.map((doc) => doc.data())
      );
      console.log("Meal Logs Snapshot:", mealLogsSnapshot.docs);
      console.log(
        "Meal Logs Data:",
        mealLogsSnapshot.docs.map((doc) => doc.data())
      );
      console.log("Meditation Logs Snapshot:", meditationLogsSnapshot.docs);
      console.log(
        "Meditation Logs Data:",
        meditationLogsSnapshot.docs.map((doc) => doc.data())
      );

      setWorkoutLogsCount(workoutLogsSnapshot.size);
      setMealLogsCount(mealLogsSnapshot.size);
      setMeditationLogsCount(meditationLogsSnapshot.size);
    } catch (error) {
      console.error("Error fetching logs count:", error);
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
        <Typography
          variant="h5"
          component="h2"
          style={{ marginTop: 20, textAlign: "left" }}
        >
          My Total Wellness Logs
        </Typography>
        <Grid container spacing={2} style={{ marginTop: 10 }}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Workout Logs:</Typography>
            <Typography variant="body1">{workoutLogsCount}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Meal Logs:</Typography>
            <Typography variant="body1">{mealLogsCount}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6">Meditation Logs:</Typography>
            <Typography variant="body1">{meditationLogsCount}</Typography>
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
