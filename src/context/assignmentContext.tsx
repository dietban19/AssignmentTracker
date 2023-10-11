import React, { createContext, useState, useEffect, useContext } from "react";
import { doc, setDoc, getDoc, addDoc, collection, query, onSnapshot,where,updateDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase.js";



type FormData = {
  [key: string]: string | number | boolean | Date | null | undefined;
};
type AssignmentContentType = {
  addNewAssignment: (n:FormData) => void;
  customizeAssignment:(n:FormData) => void;
  userAssignments:Assignment[];
  addFormPopup: boolean;
  setFormPopup: React.Dispatch<React.SetStateAction<boolean>>

  
};
export const AssignmentContext = React.createContext<AssignmentContentType>({
  addNewAssignment: () =>{},
 customizeAssignment: () =>{},
  userAssignments:[],
  addFormPopup: false, // Initialize with the default value (false)
  setFormPopup: () => {},
});
import { useUserContext } from "./userContext.jsx";
export function useAssignmentContext() {
  return useContext(AssignmentContext);
}  
type Assignment = {
  assignment: string;
  dueDate: string;
  startDate: string;
  status: string;
  subject: string;
  userId: string;
  documentId:string;

}
type AssignmentProviderProps = {
  children: React.ReactNode;
}
export const AssignmentProvider:React.FC<AssignmentProviderProps>= ({ children }) => {

  const { user } = useUserContext();
  const userID = user && user.uid;
  const [userAssignments, setUserAssignments] = useState<Assignment[]>([]);
  const [addFormPopup, setFormPopup] = useState(false);
  async function addNewAssignment(n:FormData) {
    console.log(n);
    const docRef = collection(db, "assignments");
    const newDocRef = await addDoc(docRef, n);
    await updateDoc(newDocRef, {
      documentId: newDocRef.id,
    });
    setFormPopup(false)

  }
  async function customizeAssignment(n:FormData) {
    console.log("CUSTOM");
    console.log(n);
    // console.log(docId)
    if (typeof n.documentId === 'string') {
      const assignmentDocRef = doc(db, "assignments", n.documentId);
    await updateDoc(assignmentDocRef, n);
    } else {
      // Handle the case where n.documentId is not a string
      console.error("Invalid documentId:", n.documentId);
    }
    setFormPopup(false)
  }
  // Fetch assignments associated with the specific userId
  useEffect(() => {
    const assignmentsRef = collection(db, "assignments");
      const q = query(assignmentsRef, where("userId", "==", userID));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedAssignments: Assignment[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data({
            serverTimestamps: "estimate", // Use server's best estimate if timestamp isn't finalized. 
          }) as Assignment;
          const documentId = doc.id;
          fetchedAssignments.push({ ...data, documentId });
        });
        console.log(fetchedAssignments)
        setUserAssignments(fetchedAssignments);
      });

      return () => unsubscribe();

  }, [userID]);
  const values = {
    addNewAssignment,
    customizeAssignment,
    userAssignments,
    addFormPopup,
    setFormPopup
  };
  return (
    <AssignmentContext.Provider value={values}>
      {children}
    </AssignmentContext.Provider>
  );
};
