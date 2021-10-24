/*global chrome*/
import React, { useContext, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./AuthProvider";
import useFireStore from "../hooks/useFireStore";
import { auth, db } from "../firebase/config";

export const AppContext = React.createContext();

function AppProvider({ children }) {
    const [isAddRoomVisible, setIsAddRoomVisible] = useState(false);
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState("");

    const {
        user: { uid },
    } = useContext(AuthContext);

    /**
     * {
     *      name: 'ten phong'
     *      description: 'mo ta',
     *      members: [uid1, uid2]
     * }
     */

    const roomsCondition = useMemo(() => {
        return {
            fieldName: "members",
            operator: "array-contains",
            compareValue: uid,
        };
    }, [uid]);

    const rooms = useFireStore("rooms", roomsCondition);

    const selectedRoom = useMemo(
        () => rooms.find((room) => room.id === selectedRoomId) || {},
        [rooms, selectedRoomId]
    );

    const usersCondition = useMemo(() => {
        return {
            fieldName: "uid",
            operator: "in",
            compareValue: selectedRoom.members,
        };
    }, [selectedRoom.members]);

    const members = useFireStore("users", usersCondition);

    const handleSignout = () => {
        setSelectedRoomId("");
        setIsAddRoomVisible(false);
        setIsInviteMemberVisible(false);
        const usersRef = db.collection("users");
        usersRef
            .where("uid", "==", uid)
            .get()
            .then((snap) => {
                usersRef.doc(snap.docs[0].id).update({ isOnline: false });
            });
        auth.signOut();
    };

    useEffect(() => {
        return () => {
            handleSignout();
        };
    }, []);

    return (
        <AppContext.Provider
            value={{
                rooms,
                members,
                isAddRoomVisible,
                setIsAddRoomVisible,
                isInviteMemberVisible,
                setIsInviteMemberVisible,
                selectedRoomId,
                setSelectedRoomId,
                selectedRoom,
                handleSignout,
            }}
        >
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;
