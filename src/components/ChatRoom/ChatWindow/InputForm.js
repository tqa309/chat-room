import { Button, Form, Input } from "antd";
import React, {
    useContext,
    useRef,
    useState,
} from "react";
import styled from "styled-components";
import { AuthContext } from "../../../Context/AuthProvider";
import { AppContext } from "../../../Context/AppProvider";
import { addDocument, finalMessageDisplay } from "../../../firebase/services";
import { HeartOutlined, SendOutlined } from "@ant-design/icons";

const FormStyled = styled(Form)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 2px 2px 0;
    border: 1px solid rgb(230, 230, 230);
    border-radius: 2px;
    position: absolute;
    position: 999;
    width: calc(100% - 30px);
    left: 15px;
    bottom: 0;
    border-radius: 50px;

    button {
        border-radius: 50px;
    }

    .ant-form-item {
        flex: 1;
        margin-bottom: 0;
    }

    .ant-form-item-control-input {
        min-height: 40px;
    }
`;

export default function InputForm({messageListRef, setCurMess}) {
    const {
        selectedRoom,
    } = useContext(AppContext);

    const {
        user: { uid, photoURL, displayName },
    } = useContext(AuthContext);

    const [inputValue, setInputValue] = useState("");
    const [form] = Form.useForm();

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };

    const inputRef = useRef(null);

    const handleOnSubmit = () => {
        const newMessage = {
            text: inputValue,
            uid,
            photoURL,
            roomId: selectedRoom.id,
            displayName,
        };

        setCurMess(newMessage);

        addDocument("messages", newMessage);

        if (inputRef?.current) {
            setTimeout(() => {
                inputRef.current.focus();
            });
        }


        if (messageListRef?.current) {
            messageListRef.current.scrollTop = 0
            
        }

        form.resetFields(["message"]);
    };

    return (
        <FormStyled form={form}>
            <Form.Item name="message">
                <Input
                    ref={inputRef}
                    onChange={handleInputChange}
                    onPressEnter={handleOnSubmit}
                    placeholder="Nhập tin nhắn..."
                    bordered={false}
                    autoComplete="off"
                />
            </Form.Item>
            <SendOutlined style={{ fontSize: '26px', color: '#444', marginRight: '10px'}} onClick={handleOnSubmit}/>
            <HeartOutlined style={{ fontSize: '26px', color: '#444', marginRight: '10px'}}/>
        </FormStyled>
    );
}
