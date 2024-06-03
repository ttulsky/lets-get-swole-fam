import React from "react";
import { Container, Typography, Box } from "@mui/material";

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
    <Container>
      <Typography variant="h4" gutterBottom>
        Yoga Resources
      </Typography>
      <Typography variant="body1" gutterBottom>
        {" "}
        Here we have some vetted Yoga resources from some of our Swole Fam!
        Explore these carefully selected yoga clips to help you relax and
        improve your flexibility and posture.
      </Typography>
      <hr />
      {videos.map((video) => (
        <Box key={video.id} mb={4}>
          <Typography variant="h6">{video.title}</Typography>
          <iframe
            width="100%"
            height="250" // Shorter rectangular shape
            src={video.url}
            title={video.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{ borderRadius: "10px" }}
          ></iframe>
        </Box>
      ))}
    </Container>
  );
}

export default YogaResources;
