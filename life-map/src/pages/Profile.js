import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Paper from "@material-ui/core/Paper";

const config = {
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

const UserCard = ({ viewer, user }) => {
  const [isFollowing, setIsFollowing] = useState(
    user.followers.includes(viewer)
  );
  // const [isFollowing, setIsFollowing] = useState(false);

  const handleClick = () => {
    if (!isFollowing) {
      axios
        .post("http://localhost:5000/social/follow", config, {
          recipient: user.id,
        })
        .then(() => setIsFollowing(true))
        .catch((error) => {
          console.error(error);
        });
    }
  };

  return (
    <CardContainer>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={user.avatar && ""}
          alt={user.username}
          style={{ marginRight: "16px" }}
        />
        <Typography variant="subtitle2">{user.name}</Typography>
      </div>

      <Button
        size="small"
        variant="contained"
        color={isFollowing ? "secondary " : "primary"}
        onClick={handleClick}
      >
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
    </CardContainer>
  );
};

const Profile = ({ viewerID, userID }) => {
  const [socialInfo, setSocialInfo] = useState({
    username: "Sam",
    biography: "I'm a student at NUS. I'm also an intern. I am a coder.",
  });
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/social/social-info",
          config
        );
        console.log(data);
        setSocialInfo((prev) => ({ ...prev, ...data }));
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  return (
    <Container>
      <Header>
        <Avatar
          src={socialInfo.avatar && ""}
          alt={socialInfo.username}
          style={{ height: "92px", width: "92px" }}
        />
        <UserInfo>
          <Typography variant="h4" style={{ marginBottom: "4px" }}>
            {socialInfo.username}
          </Typography>
          <Typography variant="subtitle1">{socialInfo.biography}</Typography>
        </UserInfo>
      </Header>

      <Paper square>
        <Tabs
          value={tabIndex}
          onChange={(event, newValue) => {
            setTabIndex(newValue);
          }}
          variant="fullWidth"
        >
          <Tab label="entries" />
          <Tab label="following" />
          <Tab label="followers" />
        </Tabs>
      </Paper>

      <Paper>
        {tabIndex === 1 &&
          !!socialInfo.followers &&
          socialInfo.followers.map((user) => (
            <UserCard viewer={viewerID} user={user} />
          ))}

        {tabIndex === 2 &&
          !!socialInfo.following &&
          socialInfo.following.map((user) => (
            <UserCard viewer={viewerID} user={user} />
          ))}
      </Paper>
    </Container>
  );
};

export default Profile;

const Container = styled.section`
  width: 100%;
  max-width: 750px;
  margin: 0 auto;
  padding: 48px 12px;
  display: flex;
  flex-direction: column;
  background-color: white;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 24px;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 24px;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;
