import { useState } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        setError(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            setError("All fields are required");
            return;
        }
        setLoading(true);

        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/auth/register`, formData);
            navigate('/login');
        } catch (err) {
            setError(err.message);
            return;
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Name</label>
                <input
                    name='name'
                    type='text'
                    value={formData.name}
                    onChange={handleChange}
                    placeholder='Input Name'
                />

                <label>Email</label>
                <input
                    name='email'
                    type='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='Input Email'
                />

                <label>Password</label>
                <input
                    name='password'
                    type='password'
                    value={formData.password}
                    onChange={handleChange}
                    placeholder='Input Password'
                />

                {error && <p>{error}</p>}

                <button type='submit' disabled={loading}>
                    {loading ? "Signing Up..." : "Sign Up"}
                </button>
            </form>
        </div>
    );
}

export default SignupPage;