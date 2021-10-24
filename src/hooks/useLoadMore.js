import { useEffect, useState } from "react";
import { db } from "../firebase/config";

const useLoadMore = (collection, condition, lastDoc = null, limit = 10) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(false);
    const [lastDocMessage, setLastDocMessage] = useState(null);
    const [newestDocMessage, setNewestDocMessage] = useState(null);

    useEffect(() => {
        setLoading(true);
        setDocuments([]);

        let collectionRef = db
            .collection(collection)
            .orderBy("createdAt", "desc");

        collectionRef = collectionRef.limit(limit);

        if (condition) {
            if (!condition.compareValue || !condition.compareValue.length) {
                setDocuments([]);
                return;
            }

            collectionRef = collectionRef.where(
                condition.fieldName,
                condition.operator,
                condition.compareValue
            );
        }

        const unsubscribe = collectionRef.get().then((snapshot) => {
            const documents = snapshot.docs.map((doc, index) => {
                if (index === snapshot.docs.length - 1) {
                    setLastDocMessage(doc);
                }
                if (index === 0) {
                    setNewestDocMessage(doc);
                }
                return {
                    ...doc.data(),
                    id: doc.id,
                };
            });

            setLoading(false);
            setHasMore(documents.length === limit);
            if (lastDoc || lastDocMessage) setDocuments(documents);
        });

        return unsubscribe

    }, [condition])
    
    useEffect(() => {
        setLoading(true);
        let collectionRef = db
            .collection(collection)
            .orderBy("createdAt", "desc");

        if (lastDoc) {
            collectionRef = collectionRef.startAfter(lastDoc);
        }

        collectionRef = collectionRef.limit(limit);

        if (condition) {
            if (!condition.compareValue || !condition.compareValue.length) {
                setDocuments([]);
                return;
            }

            collectionRef = collectionRef.where(
                condition.fieldName,
                condition.operator,
                condition.compareValue
            );
        }

        const unsubscribe = collectionRef.onSnapshot((snapshot) => {
            const documents = snapshot.docs.map((doc, index) => {
                if (index === snapshot.docs.length - 1) {
                    setLastDocMessage(doc);
                }
                if (index === 0) {
                    setNewestDocMessage(doc);
                }
                return {
                    ...doc.data(),
                    id: doc.id,
                };
            });

            setLoading(false);
            setHasMore(documents.length === limit);
            setDocuments((prevDocs) => [...prevDocs, ...documents]);
        });

        return unsubscribe;
    }, [lastDoc]);

    return { documents, loading, hasMore, lastDocMessage, newestDocMessage };
};

export default useLoadMore;
