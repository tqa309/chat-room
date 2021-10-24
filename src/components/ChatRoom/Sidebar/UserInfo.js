import { Button, Typography } from "antd";
import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import { auth, db } from "../../../firebase/config";
import { AuthContext } from "../../../Context/AuthProvider";
import { AppContext } from "../../../Context/AppProvider";
import UserAvatar from "../Avatar";

const UserInfoStyled = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgb(230, 230, 230);

    .username {
        margin-left: 5px;
    }
`;

export default function UserInfo() {
    const {
        user: { displayName, photoURL, isOnline }
    } = useContext(AuthContext);

    const { handleSignout } = useContext(AppContext);

    return (
        <UserInfoStyled>
            <div>
                <UserAvatar photoURL={photoURL} displayName={displayName} isOnline={isOnline} />
                <Typography.Text className="username">
                    {displayName}
                </Typography.Text>
            </div>
            <Button
                onClick={handleSignout}
            >
                Thoát
            </Button>
        </UserInfoStyled>
    );
}
