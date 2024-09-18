
import mockData from "./data";

//firebase
import { db } from '../firebase-config';
import { doc as firebaseDoc, setDoc as firebaseSetDoc, getDoc as firebaseGetDoc, 
  updateDoc as firebaseUpdateDoc , collection, query, orderBy, 
  getDocs, writeBatch, doc, deleteDoc} from 'firebase/firestore';


const bulkDocsData = mockData.map(article => {
  article._id = "article_" + article.id;
  return article;
});


const createDoc = async (db, docData) => {
  let result = undefined;

  try {
    // Create a new document reference with an auto-generated ID
    const docRef = firebaseDoc(db, "article", docData.id);

    // Set the document data
    await firebaseSetDoc(docRef, docData);
    
    // Retrieve the document to verify it has been saved
    const createdDoc = await firebaseGetDoc(docRef);
    
    if (createdDoc.exists()) {
      result = createdDoc.data();  // Access the document data
    } else {
      console.log("No such document found after creation!");
    }
  } catch (error) {
    console.log('Error creating document:', error);
  }


  return result;
};

// const createDoc = async (db, doc) => {
//   let result = undefined;

//   try {
//     const createResult = await db.put(doc);
//     // {ok: true, id: "login data", rev: "1-b08b103efa5095017319f41a75f34f39"}

//     result = await db.get(createResult.id);
//     // result = await db.allDocs({ include_docs: true });
//   } catch (error) {
//     console.log(error);
//   }

//   return result;
// };

const updateDoc = async (db, id, change) => {
  let result = undefined;

  try {
    // Create a reference to the document
    const docRef = doc(db, 'article', id);

    // Get the current document
    const docSnap = await firebaseGetDoc(docRef);

    if (docSnap.exists()) {
      // Update the document with the new changes
      await firebaseUpdateDoc(docRef, change);

      // Fetch the updated document
      const updatedDocSnap = await firebaseGetDoc(docRef);
      result = { id: updatedDocSnap.id, ...updatedDocSnap.data() };
    } else {
      console.log("No such document!");
    }
  } catch (error) {
    console.log("Error updating document:", error);
  }

  return result;
};

// const updateDoc = async (db, id, change) => {
//   let result = undefined;

//   try {
//     const doc = await db.get(id);

//     const updateResult = await db.put({
//       ...doc,
//       ...change
//     });
//     // {ok: true, id: "login data", rev: "2-5d05eb34abc05e2208ed3d46dd721219"}

//     result = await db.get(updateResult.id);
//     // result = await db.allDocs({ include_docs: true });
//   } catch (error) {
//     console.log(error);
//   }

//   return result;
// };

const removeDoc = async (db, id) => {
  let result = undefined;
  try {
    // Create a reference to the document
    const docRef = doc(db, 'article', id);

    // Delete the document
    await deleteDoc(docRef);

    // Optionally, confirm deletion or set result as true/undefined
    result = { id, deleted: true };
  } catch (error) {
    console.log("Error removing document:", error);
  }

  return result;
};

// const removeDoc = async (db, id) => {
//   let result = undefined;

//   try {
//     const doc = await db.get(id);

//     result = await db.remove(doc);
//     // result = await db.allDocs({ include_docs: true });
//   } catch (error) {
//     console.log(error);
//   }

//   return result;
// };

// const getDocsByType = async (db, type) => {
//   let result = undefined;
//   db = dbF;
//   try {
//     const index = {
//       index: {
//         fields: ['postedAt'],
//         name: 'posted-time-index',
//         ddoc: 'posted-time-index-design-doc'
//       }
//     };

//     await db.createIndex(index);
//     // const res = await db.createIndex(index);
//     // console.log('Create index successfully with response: ');
//     // console.log(res);

//     const regExp = new RegExp(type);

//     let option = {
//       selector: {
//         _id: {
//           $regex: regExp
//         }
//       }
//     };

//     if (type === 'article') {
//       // Fetch article documents by the field postedAt with descending order.
//       option = {
//         selector: {
//           _id: {
//             $regex: regExp
//           },
//           postedAt: {
//             $gt: ''
//           }
//         },
//         sort: [{
//           postedAt: 'desc'
//         }]
//       };
//     }

//     result = await db.find(option);
//   } catch (error) {
//     console.log(error);
//   }

//   return result;
// };

const getDocsByType = async (db, type) => {
  let result = [];

  try {
    // Reference to the Firestore collection
    const colRef = collection(db, type);

    // If the type is 'article', fetch all documents ordered by 'postedAt' in descending order
    let q = type === 'article'
      ? query(colRef, orderBy('postedAt', 'desc'))
      : query(colRef);

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Extract the document data
    querySnapshot.forEach((doc) => {
      result.push({ id: doc.id, ...doc.data() });
    });
  } catch (error) {
    console.log('Error retrieving documents by type:', error);
  }

  return result;
};


const getTheStoredArticles = async (db, mockData) => {
  let articles = [];

  try {
    // Fetch all articles using the provided function `getDocsByType`
    articles = await getDocsByType(db, 'article');

    // If no articles exist, insert the mock data
    if (!articles || articles.length === 0) {
      console.log("No articles found. Inserting mock data...");

      // Use a batch to insert all mockData
      const batch = writeBatch(db);
      const colRef = collection(db, 'article');

      // Add each document to the batch
      mockData.forEach((article) => {
        const docRef = doc(colRef, article.id);
        batch.set(docRef, article);
      });

      // Commit the batch
      await batch.commit();

      console.log("Mock data inserted successfully!");

      // Fetch the newly inserted documents using `getDocsByType`
      articles = await getDocsByType(db, 'article');
    }
  } catch (error) {
    console.log("Error fetching or inserting articles:", error);
  }
  return articles;
};


const loadArticles = async () => {
  return getTheStoredArticles(db, bulkDocsData);
};

//extra function
const fetchLoginDataFromFirestore = async (db) => {
  return {
    username : "test",
    password : "123456"
  };
};


const dataInitialize = async (db, mockData) => {
  let preLoadedState = {};
  try {
    const articles = await getTheStoredArticles(db, mockData);
    const loginData = await fetchLoginDataFromFirestore(db);

    // Construct the pre-loaded state object for Redux
    if (articles && articles.length !== 0) {
      preLoadedState = {
        articles: {
          data: articles
        }
      };
    }

    if (loginData && Object.keys(loginData).length !== 0) {
      const { username, password } = loginData;

      preLoadedState = {
        ...preLoadedState,
        user: {
          loginData: {
            username,
            password
          }
        }
      };
    }

  } catch (error) {
    console.log('Error initializing data:', error);
  }

  return preLoadedState;
};


// const dataInitialize = async (db, mockData) => {
//   let preLoadedState = {};

//   try {
//     const articles = await getTheStoredArticles(db, mockData);
//     const loginData = await getTheLoginData(db);

//     // Construct the pre loaded state object for redux.
//     if (articles && articles.length !== 0) {
//       preLoadedState = {
//         articles: {
//           data: articles
//         }
//       };
//     }

//     if (loginData && Object.keys(loginData).length !== 0) {
//       const { username, password } = loginData;

//       preLoadedState = {
//         ...preLoadedState,
//         user: {
//           loginData: {
//             username,
//             password
//           }
//         }
//       }
//     }

//   } catch (error) {
//     console.log(error);
//   }

//   return preLoadedState;
// };



const loadData = async () => {
  return dataInitialize(db, bulkDocsData);
};

export {
  db,
  bulkDocsData,
  createDoc,
  getDocsByType,
  updateDoc,
  removeDoc,
  loadArticles,
  loadData
};