import React from "react";
import { Row, Col } from "antd";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";

export default function ChatRoom() {
    return (
        <div>
            <Row>
                <Col xs={2} md={1} xl={4}>
                </Col>
                <Col xs={20} md={8} xl={5}>
                    <Sidebar />
                </Col>
                <Col xs={20} md={14} xl={11}>
                    <ChatWindow />
                </Col>
                <Col xs={2} md={1} xl={4}>
                </Col>
            </Row>
        </div>
    );
}
