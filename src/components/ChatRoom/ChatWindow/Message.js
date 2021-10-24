import { Avatar, Tooltip, Typography } from "antd";
import { formatRelative } from "date-fns";
import React, { useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../../../Context/AuthProvider";

const WrapperStyled = styled.div`

    .author {
        margin-left: 5px;
        font-weight: bold;
    }

    .date {
        font-size: 11px;
        color: #a7a7a7;
    }

    .content-wrapper {
        white-space: normal;
        display: flex;
        overflow-wrap: break-word;
        flex-direction: column;
        margin: 7px 0;
    }

    .content-receive {
        background-color: rgb(239, 239, 239);
        border-radius: 5px 22px 22px 22px;
        align-self: flex-start;
    }

    .content-send {
        background-color: #4747f7;
        border-radius: 22px 5px 22px 22px;
        align-self: flex-end;

        span {
            color: white;
            text-align: left;
        }
    }
`;

const TextWrapper = styled.div`
    margin-left: 30px;
    padding: 12px 16px;
    max-width: 250px;

    span {
        overflow-wrap: break-word;
        white-space: normal;
    }
`

function formatDate(seconds) {
    let formattedDate = "";

    if (seconds) {
        formattedDate = formatRelative(new Date(seconds * 1000), new Date());

        formattedDate =
            formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

        if (formattedDate.includes('Today at')) {
            formattedDate = formattedDate.slice(8)
        }
    }

    return formattedDate;
}

export default function Message({
    textArray,
    text,
    displayName,
    createdAt,
    photoURL,
    uid,
    breakTime,
    referrence,
    liveMessageColor,
}) {
    const { user } = useContext(AuthContext);

    return (
        <WrapperStyled ref={referrence}>
            {uid !== user.uid ? (
                <>
                    {breakTime ? (
                        <div style={{ textAlign: 'center'}}>
                            <Typography.Text className="date">
                                {formatDate(breakTime.seconds)}
                            </Typography.Text>
                        </div>
                    ) : ''}
                    <div>
                        <Avatar size="small" src={photoURL}>
                            A
                        </Avatar>
                        <Typography.Text className="author">
                            {displayName}
                        </Typography.Text>
                    </div>
                    <div>
                        {text ? (<div className="content-wrapper">
                                <Tooltip
                                    trigger="click"
                                    placement="right"
                                    title={formatDate(
                                        createdAt?.seconds
                                    )}
                                >
                                    <TextWrapper className="content-receive">
                                        <Typography.Text>{text}</Typography.Text>
                                    </TextWrapper>
                                </Tooltip>
                            </div>) : (textArray?.map((textItem) => (
                            <div className="content-wrapper">
                                <Tooltip
                                    trigger="click"
                                    placement="right"
                                    title={formatDate(
                                        textItem.createdAt?.seconds
                                    )}
                                >
                                    <TextWrapper className="content-receive">
                                        <Typography.Text>{textItem.text}</Typography.Text>
                                    </TextWrapper>
                                </Tooltip>
                            </div>
                        )))}
                    </div>
                </>
            ) : (
                <>
                    {breakTime ? (
                        <div style={{ textAlign: 'center'}}>
                            <Typography.Text className="date">
                                {formatDate(breakTime.seconds)}
                            </Typography.Text>
                        </div>
                    ) : ''}
                    <div style={{backgroundColor: liveMessageColor}}>
                        {text ? (<div className="content-wrapper">
                                <Tooltip
                                    trigger="click"
                                    placement="left"
                                    title={formatDate(
                                        createdAt?.seconds
                                    )}
                                >
                                    <TextWrapper className="content-send">
                                        <Typography.Text>{text}</Typography.Text>
                                    </TextWrapper>
                                </Tooltip>
                            </div>) : (textArray.map((textItem) => (
                            <div className="content-wrapper">
                                <Tooltip
                                    trigger="click"
                                    placement="left"
                                    title={formatDate(
                                        textItem.createdAt?.seconds
                                    )}
                                >
                                    <TextWrapper className="content-send">
                                        <Typography.Text>{textItem.text}</Typography.Text>
                                    </TextWrapper>
                                </Tooltip>
                            </div>
                        )))}
                    </div>
                </>
            )}
        </WrapperStyled>
    );
}
