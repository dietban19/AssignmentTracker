import React, { useState, ChangeEvent, FormEvent } from "react";
import "./main.css";
import { useUserContext } from "../../context/userContext";
import { auth, db } from "../../config/firebase.js";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAssignmentContext } from "../../context/assignmentContext";
const main = () => {
  const { user, loadingAuthState, setLoadingAuthState } = useUserContext();
  // const [editingAssignmentIndex, setEditingAssignmentIndex] = useState<number | null>(null);
  const { addNewAssignment,userAssignments,customizeAssignment,addFormPopup, setFormPopup } = useAssignmentContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    assignment: "",
    status: "",
    startDate: "",
    dueDate: "",
    userId: user && user.uid,
  });
  type FormData = {
    [key: string]: string | number | boolean | Date | null | undefined;
  };
  const [editingAssignmentIndex, setEditingAssignmentIndex] = useState<number| null>(null);

  const handleChange = (e:ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };
  function signOutFunc() {
    signOut(auth)
      .then(() => {})
      .catch((error) => {
        // An error happened.
      });
  }

  async function handleLogOut() {
    console.log("singing out");
    try {
      signOutFunc();
      setLoadingAuthState(true);
      navigate("/signup");
      setLoadingAuthState(false);
    } catch (err) {
      console.log("error: ", err);
      // setError("Failed to log out");
    }
  }
  const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(editingAssignmentIndex)
    if (editingAssignmentIndex !== null) {
      console.log("CUSTOME")
      // Editing an existing assignment
      customizeAssignment(formData)
    }else{
      console.log("NOT CUSTOME")
      addNewAssignment(formData);
    }

   
    // You can send this formData to a backend or set it in a state at a higher-level component.
    // Reset the form if needed
    setFormData({
      subject: "",
      assignment: "",
      status: "",
      startDate: "",
      dueDate: "",
      userId: user && user.uid,
      });

  };
  const handleRowDoubleClick = (assignment: typeof userAssignments[0]) => {
    setFormData({
      ...assignment,
      userId: user && user.uid, // Keep the userId unchanged
    });
    setFormPopup(true);
    console.log(assignment);
    setEditingAssignmentIndex(1)

  };
  
  if (addFormPopup) {
    return (
      <div className="form-container">
        <button
          onClick={() => {
            setFormPopup(false);
          }}
        >
          Close
        </button>

        <form onSubmit={handleSubmit}>
          <div>
            <label>
              Subject:
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
              />
            </label>
          </div>

          <div>
            <label>
              Assignment:
              <textarea
                name="assignment"
                value={formData.assignment}
                onChange={handleChange}
              />
            </label>
          </div>

          <div>
            <label>
              Status:
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </label>
          </div>

          <div>
            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
              />
            </label>
          </div>

          <div>
            <label>
              Due Date:
              <input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </label>
          </div>

          <div>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    );
  }
  return (
    <div className="main-wrapper">
      <div className="main-container">
        <div className="main-header">Assignment Tracker</div>
        <button
          onClick={() => {
            setFormPopup(true);
          }}
        >
          add
        </button>
        <button onClick={handleLogOut}>Log out</button>
        <div className="table-container">
          {" "}
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Assignment</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {userAssignments.map((assignment, index) => (
                <tr key={index} onDoubleClick={() => handleRowDoubleClick(assignment)}>
                  <td>{assignment.subject}</td>
                  <td>{assignment.assignment}</td>
                  <td>{assignment.status}</td>
                  <td>{assignment.startDate}</td>
                  <td>{assignment.dueDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default main;
