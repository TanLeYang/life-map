import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from '@material-ui/icons/Clear';
import useSocialButton from '../hooks/useSocialButton.js';

const config = {
  withCredentials: true,
  headers: {
    "content-type": "application/json",
  },
};

/**
 * @description Component to display a single user card in a list of followers/following users
 * @props {object} profileInfo - the profile's info. Used to check profile user relationship with the user displayed in this Card
 * @props {function} setProfileInfo - function to set profileInfo state
 * @props {object} user - the user object to render
 * @props {function} changeProfile - a route handler to change the current user being displayed on
 * @props {boolean} isViewingOwn - Viewing own profile or other's profile
 * @props {string} type - Describing the role of the Card, either in the followers tab or following tab
 * the profile page
 */
const UserCard = ({ profileInfo, setProfileInfo, user, changeProfile, isViewingOwn, type }) => {

  const [isFollowing, requestSent, handleButtonClick] = useSocialButton(profileInfo, setProfileInfo, user);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:5000/profile/user",
          { id: user.id },
          config
        );
        if (data.success) {
          setProfilePic(data.profile_pic);
        } else {
          // display some error to front end here
        }
      } catch (error) {
        console.error(error);
      }
    })();
  }, [user]);

  
  const removeFollower = (event) => {
    event.stopPropagation();
    const relationship = profileInfo.followers.filter((relation) => relation.follower === user.id)[0];
    return axios.post(
      "/social/remove-follower-relationship",
      relationship,
      config
    ).then(() => {
      const new_followers = profileInfo.followers.filter((relation) => relation.follower !== user.id);
      setProfileInfo({
        ...profileInfo,
        followers: new_followers
      });
    })
  }

  return (
    <CardContainer onClick={() => changeProfile(user.id)}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          src={profilePic || ""}
          alt={user.name}
          style={{ marginRight: "16px" }}
        />
        <Typography variant="subtitle2">{user.name}</Typography>
      </div>
      {isViewingOwn && 
        <div>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleButtonClick}
          >
            {requestSent ? "Requested"
              : isFollowing ? "Following"
                  : "Follow"}
          </Button>
          {type === 'follower' && 
            <IconButton
              color="secondary"
              onClick={removeFollower}
            >
              <ClearIcon/>
            </IconButton>
          }
        </div>
      }
    </CardContainer>
  );
};

export default UserCard;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 12px 24px;
  cursor: pointer;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;
