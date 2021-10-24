import React, { useContext, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { AppContext } from "../../../Context/AppProvider";
import { finalMessageDisplay } from "../../../firebase/services";
import useFindNewestMessage from "../../../hooks/useFindNewestMessage";
import useSendMessage from "../../../hooks/useSendMessage";
import InputForm from "./InputForm";
import Message from "./Message";

const LiveMessageListStyled = styled.div`
    max-height: 100%;
    margin-top: -5px;
    display: flex;
    flex-direction: column-reverse;
    position: relative;
    max-height: max-content;
`;

export default function LiveSection({messageListRef}) {
    const { selectedRoomId } = useContext(AppContext);
    
    const newestDocMessageCondition = useMemo(
        () => ({
            fieldName: "roomId",
            operator: "==",
            compareValue: selectedRoomId,
        }),
        [selectedRoomId]
    );

    const { newestDocMessage } = useFindNewestMessage(
        "messages",
        newestDocMessageCondition
    );

    const [newestDoc, setNewestDoc] = useState(null)

    useEffect(() => {
        setNewestDoc(newestDocMessage)
    })


    useEffect(() => {
        if (messageListRef?.current) {
            messageListRef.current.scrollTop = 0
        }
    }, [newestDoc])

    const liveMessagesCondition = useMemo(() => {
        return {
            fieldName: "roomId",
            operator: "==",
            compareValue: selectedRoomId,
        };
    }, [selectedRoomId]);

    const [curMess, setCurMess] = useState(null);

    const liveMessages = useSendMessage(
        "messages",
        liveMessagesCondition,
        newestDoc,
        curMess
    );

    const finalLiveMessages = finalMessageDisplay(liveMessages ,true);

    return (
        <>
            <LiveMessageListStyled>
                {finalLiveMessages.map((mes, index) => (
                    <Message
                        key={mes.id}
                        textArray={mes.textArray}
                        photoURL={mes.photoURL}
                        displayName={mes.displayName}
                        createdAt={mes.lastMessageTime}
                        uid={mes.uid}
                        breakTime={mes.breakTime}
                        liveMessageColor="red"
                    />
                ))}
            </LiveMessageListStyled>
            <InputForm
                setCurMess={setCurMess}
                messageListRef={messageListRef}
            />
        </>
    );
}
