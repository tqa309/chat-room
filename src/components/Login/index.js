import React from "react";
import { Row, Col, Typography, Button } from "antd";
import firebase, { auth, db } from "../../firebase/config";
import { addDocument, generateKeywords } from "../../firebase/services";

const { Title } = Typography;

const fbProvider = new firebase.auth.FacebookAuthProvider();

export default function Login() {
    const handleFbLogin = async () => {
        const { additionalUserInfo, user } = await auth.signInWithPopup(
            fbProvider
        );

        if (additionalUserInfo?.isNewUser) {
            addDocument("users", {
                displayName: user.displayName,
                email: user.email,
                photoURL: user.photoURL,
                uid: user.uid,
                providerId: additionalUserInfo.providerId,
                keywords: generateKeywords(user.displayName),
                isOnline: true,
            });
        } else {
            const usersRef = db.collection('users')
            usersRef.where("uid", "==", user.uid).get().then(snap => {
                usersRef.doc(snap.docs[0].id).update({isOnline: true});
            })
        }
    };

    return (
        <div>
            <Row justify="center" style={{ height: 800 }}>
                <Col span={8}>
                    <Title level={3} style={{ textAlign: "center" }}>
                        ChatRoom
                    </Title>
                    <Button style={{ width: "100%", marginBottom: 5 }}>
                        Đăng nhập bằng Google
                    </Button>
                    <Button style={{ width: "100%" }} onClick={handleFbLogin}>
                        Đăng nhập bằng Facebook
                    </Button>
                </Col>
            </Row>
        </div>
    );
}
