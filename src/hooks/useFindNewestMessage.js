import { db } from "../firebase/config";
import { useEffect, useState } from "react";


const useFindNewestMessage = (collection, condition) => {
    const [newestDocMessage, setNewestDocMessage] = useState(null)
    
    useEffect(() => {
        const collectionRef = db
        .collection(collection)
        .orderBy("createdAt", "desc")
        .limit(1)
        .where(
            condition.fieldName,
            condition.operator,
            condition.compareValue
        );

        const unsubscribe = collectionRef.get().then((snapshot) => {
            if (!snapshot.empty) {
                setNewestDocMessage(snapshot.docs[0])
            }
        });

        return unsubscribe
    }, [condition])

    return { newestDocMessage };
};

export default useFindNewestMessage;
