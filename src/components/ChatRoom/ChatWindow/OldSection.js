import { Spin, Typography } from "antd";
import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import styled, { css } from "styled-components";
import { AppContext } from "../../../Context/AppProvider";
import { finalMessageDisplay } from "../../../firebase/services";
import useLoadMore from "../../../hooks/useLoadMore";
import LiveSection from "./LiveSection";
import Message from "./Message";

const ContentStyled = styled.div`
    height: calc(100% - 56px);
    display: flex;
    flex-direction: column;
    padding: 11px;
    justify-content: flex-end;
    padding: 0 0 0 20px;
`;

const MessageListStyled = styled.div`
    max-height: calc(100% - 50px);
    margin-bottom: 60px;
    padding-right: 20px;
    display: flex;
    flex-direction: column-reverse;
    overflow-y: auto;
`;

const StyledSpin = styled(Spin)`
    margin-top: 10px;
    visibility: hidden;
    ${props => props.visible && css`
    visibility: visible;
    `}
`


export default function OldSection() {
    const { selectedRoomId } = useContext(AppContext);

    const condition = useMemo(
        () => ({
            fieldName: "roomId",
            operator: "==",
            compareValue: selectedRoomId,
        }),
        [selectedRoomId]
    );

    const [lastDoc, setLastDoc] = useState(null);

    const { documents, hasMore, loading, lastDocMessage } =
        useLoadMore("messages", condition, lastDoc);

    const finalMessages = finalMessageDisplay(documents);

    const messageListRef = useRef(null);

    const observer = useRef();
    const lastMessagelementRef = useCallback(
        (node) => {
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setLastDoc(lastDocMessage);
                }
            });
            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    return (
        <ContentStyled>
            <MessageListStyled ref={messageListRef}>
                
                <LiveSection messageListRef={messageListRef}/>
                {finalMessages.length ? finalMessages.map((mes, index) => {
                    if (index === finalMessages.length - 1) {
                        return (
                            <Message
                                referrence={lastMessagelementRef}
                                textArray={mes.textArray}
                                photoURL={mes.photoURL}
                                displayName={mes.displayName}
                                createdAt={mes.lastMessageTime}
                                uid={mes.uid}
                                breakTime={mes.breakTime}
                            />
                        );
                    } else {
                        return (
                            <Message
                                textArray={mes.textArray}
                                photoURL={mes.photoURL}
                                displayName={mes.displayName}
                                createdAt={mes.lastMessageTime}
                                uid={mes.uid}
                                breakTime={mes.breakTime}
                            />
                        );
                    }
                }) : (!loading && <Typography.Text style={{ textAlign: "center", fontSize: "11px", color: "#a7a7a7", marginBottom: "5px"}}>Hãy bắt đầu cuộc trò chuyện</Typography.Text>)}
                
                <StyledSpin visible={loading} />
            </MessageListStyled>
        </ContentStyled>
    );
}
