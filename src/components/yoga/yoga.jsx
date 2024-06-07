import React from "react";
import { Container, Typography, Box } from "@mui/material";
import "./yoga.css";

const videos = [
  {
    id: "v1",
    title: "Yoga for Beginners",
    url: "https://www.youtube.com/embed/v7AYKMP6rOE",
  },
  {
    id: "v2",
    title: "Morning Yoga Routine",
    url: "https://www.youtube.com/embed/4pKly2JojMw",
  },
  {
    id: "v3",
    title: "Yoga for Relaxation",
    url: "https://www.youtube.com/embed/oBu-pQG6sTY",
  },
  {
    id: "v4",
    title: "Hot Yoga | 26 + 2 with PJ Akabari",
    url: "https://www.youtube.com/embed/ZQruwcNjt4Y?si=ooLasKfM9m-TgZyj",
  },
  {
    id: "v5",
    title: "Hot Yoga | 26 + 2 with Liz Baghaei",
    url: "https://www.youtube.com/embed/xf4EX_oeOy0?si=3L6-bukEhCbCbCDI",
  },
  {
    id: "v6",
    title: "Hot Yoga | 26 + 2 with Bianca Costa",
    url: "https://www.youtube.com/embed/2GDhDJsVyvA?si=XVGEr1qcr5a6BNwf",
  },
];

function YogaResources() {
  return (
    <Container className="yoga-container">
      <br />

      <Typography variant="h4" gutterBottom>
        Yoga Resources
      </Typography>
      <Typography variant="body1" gutterBottom>
        Here we have some vetted yoga resources! Explore these carefully
        selected yoga clips to help you relax, improve your flexibility and
        posture.
      </Typography>

      <hr />
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 4,
        }}
      >
        {videos.map((video) => (
          <Box
            key={video.id}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">{video.title}</Typography>
            <Box
              component="iframe"
              src={video.url}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sx={{
                width: "100%",
                height: { xs: 250, md: 300 },
                borderRadius: "10px",
              }}
            ></Box>
          </Box>
        ))}
      </Box>
      <hr />
    </Container>
  );
}

export default YogaResources;
