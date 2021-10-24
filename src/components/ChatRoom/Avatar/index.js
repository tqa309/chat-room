import { Avatar, Button, Typography } from "antd";
import React, { useContext, useEffect } from "react";
import styled, { css } from "styled-components";

const AvatarWrapper = styled.div`
    position: relative;
    display: inline-block;
`;

const OnlineDot = styled.div`
    position: absolute;
    bottom: 0;
    left: 22px;
    width: 12px;
    height: 12px;
    border: 2px solid white;
    border-radius: 50%;
    background-color: lightgray;

    ${props => props.isOnline && css`
        background-color: #00d100;
    `}
`;

export default function UserAvatar({ size, isOnline, photoURL, displayName, ...props }) {
    return (
        <AvatarWrapper {...props}>
            <Avatar src={photoURL} size={size}>
                {photoURL ? "" : displayName?.charAt(0)?.toUpperCase()}
            </Avatar>
            <OnlineDot isOnline={isOnline} />
        </AvatarWrapper>
    );
}
