import firebase, { db } from "./config";

export const addDocument = (collection, data) => {
    const query = db.collection(collection);

    const timeStamp = new Date()

    query.add({
        ...data,
        createdAt: timeStamp,
    });
};

// tao keywords cho displayName, su dung cho search
export const generateKeywords = (displayName) => {
    displayName = displayName.toLowerCase();
    const name = displayName.split(" ").filter((word) => word);

    const length = name.length;
    let flagArray = [];
    let result = [];
    let stringArray = [];

    for (let i = 0; i < length; i++) {
        flagArray[i] = false;
    }

    const createKeywords = (name) => {
        const arrName = [];
        let curName = "";
        name.split("").forEach((letter) => {
            curName += letter;
            arrName.push(curName);
        });
        return arrName;
    };

    function findPermutation(k) {
        for (let i = 0; i < length; i++) {
            if (!flagArray[i]) {
                flagArray[i] = true;
                result[k] = name[i];

                if (k === length - 1) {
                    stringArray.push(result.join(" "));
                }

                findPermutation(k + 1);
                flagArray[i] = false;
            }
        }
    }

    findPermutation(0);
 
    const keywords = stringArray.reduce((acc, cur) => {
        const words = createKeywords(cur);
        return [...acc, ...words];
    }, []);

    return keywords;
};

export const finalMessageDisplay = (firstArray, isLiveMessage = false) => {
    const mesArray = [...firstArray]
    let length = mesArray.length;

    if (isLiveMessage) {
        mesArray.reverse()
        length--
    }

    const result = [];
    let textArray = [];

    for (let i = 0; i < length; i++) {
        const {text, createdAt, ...finalMessage} = mesArray[i]
        textArray.unshift({text, createdAt})

        /**
         * Neu cung mot user va khong cach nhau
         * qua 10 phut thi gom lai thanh mot doan
         * tin nhan
         */
		while (mesArray[i + 1]?.uid === mesArray[i].uid && mesArray[i].createdAt.seconds - mesArray[i + 1].createdAt.seconds <= 60) {
            const {text, createdAt} = mesArray[i + 1]
            if (!(isLiveMessage && i + 1 === length)) textArray.unshift({text, createdAt})
            i++
        }

        /**
         * Neu khoang cach giua 2 tin nhan qua
         * 10 phut thi tach ra. breakTime bang 
         * thoi gian cua tin moi hon
         */
        if (mesArray[i].createdAt.seconds - mesArray[i + 1]?.createdAt.seconds > 60) {
            finalMessage.breakTime = mesArray[i].createdAt
        }

        if (i === length - 1) {
            finalMessage.breakTime = mesArray[i].createdAt
        }

        finalMessage.textArray = textArray
        
        result.push(finalMessage)
        textArray = []
    }

    return result
}
