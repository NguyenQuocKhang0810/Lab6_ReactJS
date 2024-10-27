import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button, Form, Table } from "react-bootstrap";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [studentName, setStudentName] = useState("");
  const [studentCode, setStudentCode] = useState("");
  const inputRef = useRef();
  const [isActive, setIsActive] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://student-api-nestjs.onrender.com/students"
      );

      const data = await response.json();
      setStudents(data.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const count = students.filter((student) => student.selected).length;
    setSelectedCount(count);
  }, [students]);

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!studentName || !studentCode) {
      alert("Please fill out all required fields.");
      return;
    }

    try {
      const response = await fetch(
        "https://student-api-nestjs.onrender.com/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: studentName,
            studentCode: studentCode,
            isActive: isActive,
          }),
        }
      );
      const student = await response.json();

      if (student && student.name && student.studentCode) {
        const newStudents = {
          name: studentName,
          studentCode: studentCode,
          isActive: isActive,
          selected: false,
        };
        setStudents([newStudents, ...students]);
      } else {
        fetchData();
      }
      setStudentName("");
      setStudentCode("");
      setIsActive(false);

      inputRef.current.focus();
    } catch (error) {
      console.error("Error adding student:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const studentToDelete = students.find((student) => student._id === id);

      if (studentToDelete && studentToDelete.selected) {
        setSelectedCount(selectedCount - 1);
      }

      await fetch(`https://student-api-nestjs.onrender.com/students/${id}`, {
        method: "DELETE",
      });
      setStudents(students.filter((student) => student._id !== id));
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  const handleSelectStudent = (index) => {
    const newStudents = [...students];
    newStudents[index].selected = !newStudents[index].selected;
    setStudents(newStudents);
  };

  const handleClearStudent = async () => {
    try {
      await Promise.all(
        students.map((student) =>
          fetch(
            `https://student-api-nestjs.onrender.com/students/${student._id}`,
            {
              method: "DELETE",
            }
          )
        )
      );
      setStudents([]);
      setSelectedCount(0);
    } catch (error) {
      console.error("Error clearing students:", error);
    }
  };

  return (
    <div className="container mx-auto p-8 bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-semibold">
          Total Selected Students: {selectedCount}
        </h2>
        <Button
          variant="primary"
          onClick={handleClearStudent}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Clear
        </Button>
      </div>

      {/* Form */}
      <Form className="bg-white shadow-md rounded-lg p-6 mb-8">
        <Form.Group className="mb-4">
          <Form.Label className="block text-gray-700 text-sm font-bold mb-2">
            Student Name
          </Form.Label>
          <Form.Control
            ref={inputRef}
            value={studentName}
            type="text"
            placeholder="Enter Student Name"
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setStudentName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="block text-gray-700 text-sm font-bold mb-2">
            Student Code
          </Form.Label>
          <Form.Control
            value={studentCode}
            type="text"
            placeholder="Enter Student Code"
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setStudentCode(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            label="Still Active"
            checked={isActive}
            className="text-gray-700"
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Student
        </Button>
      </Form>

      {/* Table */}
      <Table striped bordered hover className="mt-6">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th className="p-4">Select</th>
            <th className="p-4">Student Name</th>
            <th className="p-4">Student Code</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-4">
                <Form.Check
                  type="checkbox"
                  checked={student.selected}
                  onChange={() => handleSelectStudent(index)}
                />
              </td>
              <td className="p-4">
                <Link
                  to={`/students/${student._id}`}
                  className="text-blue-500 hover:underline"
                >
                  {student.name}
                </Link>
              </td>
              <td className="p-4">{student.studentCode}</td>
              <td className="p-4">
                <Button variant={student.isActive ? "info" : "secondary"}>
                  {student.isActive ? "Active" : "Inactive"}
                </Button>
              </td>

              <td className="p-4">
                <Button
                  variant="danger"
                  onClick={() => handleDelete(student._id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default StudentList;
