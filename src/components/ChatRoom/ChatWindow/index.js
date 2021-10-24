import { UserAddOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Tooltip } from "antd";
import React, {
    useContext,
} from "react";
import styled from "styled-components";
import { AppContext } from "../../../Context/AppProvider";
import UserAvatar from "../Avatar";
import OldSection from "./OldSection";

const WrapperStyled = styled.div`
    height: calc(100vh - 40px);
    border: 1px solid rgb(230, 230, 230);
    border-radius: 0 5px 5px 0;
    background-color: white;
    border-left: none;
`;

const HeaderStyled = styled.div`
    display: flex;
    justify-content: space-between;
    height: 56px;
    padding: 28px 16px;
    align-items: center;
    border-bottom: 1px solid rgb(230, 230, 230);

    .header {
        &__info {
            display: flex;
            flex-direction: column;
            justify-content: center;
        }

        &__title {
            margin: 0;
            font-weight: bold;
        }

        &__description {
            font-size: 12px;
        }
    }
`;

const ButtonGroupStyled = styled.div`
    display: flex;
    align-items: center;
`;


export default function ChatWindow() {
    const {
        selectedRoom,
        members,
        setIsInviteMemberVisible,
    } = useContext(AppContext);

    const handleInviteMember = () => {
        setIsInviteMemberVisible(true);
    };

    return (
        <WrapperStyled>
            {selectedRoom.id ? (
                <>
                    <HeaderStyled>
                        <div className="header__info">
                            <p className="header__title">
                                {selectedRoom?.name}
                            </p>
                            <span className="header__description">
                                {selectedRoom?.description}
                            </span>
                        </div>
                        <ButtonGroupStyled>
                            <Button
                                type="text"
                                icon={<UserAddOutlined />}
                                onClick={handleInviteMember}
                            >
                                Mời
                            </Button>
                            <Avatar.Group maxCount={5}>
                                {members.map((member) => (
                                    <Tooltip
                                        title={member.displayName}
                                        key={member.id}
                                    >
                                        <UserAvatar photoURL={member.photoURL} displayName={member.displayName} isOnline={member.isOnline}/>
                                    </Tooltip>
                                ))}
                            </Avatar.Group>
                        </ButtonGroupStyled>
                    </HeaderStyled>
                    <OldSection />
                </>
            ) : (
                <Alert
                    message="Hãy chọn phòng"
                    type="info"
                    showIcon
                    style={{ margin: 5 }}
                    closable
                />
            )}
        </WrapperStyled>
    );
}
