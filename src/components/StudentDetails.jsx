import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Card } from "react-bootstrap";

const StudentDetails = () => {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentsID = async () => {
      try {
        const response = await fetch(
          `https://student-api-nestjs.onrender.com/students/${id}`
        );
        const data = await response.json();
        setStudent(data.data);
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    fetchStudentsID();
  }, [id]);

  const handleEdit = () => {
    setEditStudent({ ...student });
    setIsEditing(true);
  };

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://student-api-nestjs.onrender.com/students/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editStudent),
        }
      );
      const data = await response.json();
      setStudent(data.data);
      setIsEditing(false);
      setEditStudent(null);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to discard changes?")) {
      setIsEditing(false);
      setEditStudent(null);
    }
  };

  const handleBackToPage = () => {
    navigate("/");
  };

  if (!student) return <div>Loading...</div>;

  return isEditing ? (
    <Form className="p-8 bg-gray-100 rounded-lg shadow-md max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">
        Edit Student
      </h2>
      <Form.Group className="mb-4">
        <Form.Label className="block text-gray-600 font-medium">
          Student Name
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={editStudent.name}
          className="border border-gray-300 p-2 rounded-md w-full"
          onChange={(e) => {
            setEditStudent({ ...editStudent, name: e.target.value });
          }}
        />
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label className="block text-gray-600 font-medium">
          Student Code
        </Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter code"
          value={editStudent.studentCode}
          className="border border-gray-300 p-2 rounded-md w-full"
          onChange={(e) => {
            setEditStudent({ ...editStudent, studentCode: e.target.value });
          }}
        />
      </Form.Group>

      <Form.Group className="mb-6">
        <Form.Check
          type="checkbox"
          label="Active"
          checked={editStudent.isActive}
          className="text-gray-600"
          onChange={(e) =>
            setEditStudent({ ...editStudent, isActive: e.target.checked })
          }
        />
      </Form.Group>

      <div className="flex gap-4">
        <Button
          variant="warning"
          type="submit"
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md"
          onClick={handleUpdateStudent}
        >
          Save
        </Button>
        <Button
          variant="primary"
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    </Form>
  ) : (
    <Card className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <Card.Body>
        <h2 className="text-xl font-semibold text-gray-700">Student Details</h2>
        <p className="text-gray-600 mt-4">Name: {student.name}</p>
        <p className="text-gray-600">Code: {student.studentCode}</p>
        <p className="text-gray-600">
          Active: {student.isActive ? "Yes" : "No"}
        </p>
        <div className="flex mt-6 gap-4">
          <Button
            variant="warning"
            className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md"
            onClick={handleEdit}
          >
            Edit
          </Button>
          <Button
            variant="primary"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md"
            onClick={handleBackToPage}
          >
            Back to page
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default StudentDetails;
