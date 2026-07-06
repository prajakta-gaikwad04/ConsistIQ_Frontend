import { useEffect, useState } from "react";
import axios from "axios";

const Users = () => {

    const [users, setUsers] = useState([]);

    const loadUsers = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await axios.get("http://localhost:8081/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setUsers(res.data);

        } catch (error) {
            console.log(error);
        }
    };

    const deleteUser = async (id) => {
        try {
            const token = localStorage.getItem("token");

            await axios.delete(`http://localhost:8081/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            loadUsers();

        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    return (
        <div>
            <h2>Users Management</h2>

            <table border="1" width="100%">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    style={{ color: "red" }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;