import React, { useContext, useEffect, useMemo, useState } from "react";
import { Form, Select, Modal, Avatar, Spin } from "antd";
import { AppContext } from "../../Context/AppProvider";
import { addDocument } from "../../firebase/services";
import { AuthContext } from "../../Context/AuthProvider";
import { debounce } from "lodash";
import { db } from "../../firebase/config";

function DebounceSelect({
    fetchOptions,
    debounceTimeout = 300,
    curMembers,
    ...props
}) {
    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, curMembers).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, curMembers]);

    useEffect(() => {
        return () => {
            // clear when unmount
            setOptions([]);
        };
    }, []);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            {...props}
        >
            {options.map((opt) => (
                <Select.Option
                    key={opt.value}
                    value={opt.value}
                    title={opt.label}
                >
                    <Avatar size="small" src={opt.photoURL}>
                        {opt.photoURL
                            ? ""
                            : opt.value?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {` ${opt.label}`}
                </Select.Option>
            ))}
        </Select>
    );
}

async function fetchUserList(search, curMembers) {
    return db
        .collection("users")
        .where("keywords", "array-contains", search?.toLowerCase())
        .orderBy("displayName")
        .limit(20)
        .get()
        .then((snapshot) => {
            return snapshot.docs
                .map((doc) => ({
                    label: doc.data().displayName,
                    value: doc.data().uid,
                    photoURL: doc.data().photoURL,
                }))
                .filter((opt) => !curMembers.includes(opt.value));
        });
}

export default function InviteMemberModal() {
    const [value, setValue] = useState([]);
    const {
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        selectedRoom,
        selectedRoomId,
    } = useContext(AppContext);
    const [form] = Form.useForm();

    const handleOk = () => {
        form.resetFields();

        // update members in current room

        const roomRef = db.collection("rooms").doc(selectedRoomId);

        roomRef.update({
            members: [
                ...selectedRoom.members,
                ...value.map((val) => val.value),
            ],
        });

        setIsInviteMemberVisible(false);
    };

    const handleCancel = () => {
        form.resetFields();

        setIsInviteMemberVisible(false);
    };

    return (
        <div>
            <Modal
                title="Mời thêm thành viên"
                visible={isInviteMemberVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout="vertical">
                    <DebounceSelect
                        mode="multiple"
                        label="Tên các thành viên"
                        value={value}
                        placeholder="Nhập tên thành viên"
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => setValue(newValue)}
                        style={{ width: "100%" }}
                        curMembers={selectedRoom.members}
                    />
                </Form>
            </Modal>
        </div>
    );
}
