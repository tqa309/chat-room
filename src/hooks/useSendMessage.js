import { useEffect, useState } from "react";
import { db } from "../firebase/config";

const useSendMessage = (collection, condition, newestDoc, sentMessage) => {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        return () => {
            setDocuments([]);
        }

    }, [condition])

    useEffect(() => {
        let collectionRef 

        if (!newestDoc) {
            collectionRef = db.collection(collection).orderBy("createdAt").limitToLast(1);
        }
        else {
            collectionRef = db.collection(collection).orderBy("createdAt").startAt(newestDoc);
        }

        if (condition) {
            collectionRef = collectionRef.where(
                condition.fieldName,
                condition.operator,
                condition.compareValue
            );
        }

        const unsubscribe = collectionRef.onSnapshot((snapshot) => {
            const documents = snapshot.docs.map((doc) => ({
                ...doc.data(),
                id: doc.id,
            }));

            if (newestDoc) {
                setDocuments(documents);
            }
                
        });

        return unsubscribe;
    }, [newestDoc]);

    return documents;
};

export default useSendMessage;
