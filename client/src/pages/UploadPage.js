import { useState } from "react";
import axios from 'axios';

function Upload() {
    const [formData, setFormData] = useState({
        message: '',
        level: '',
        source: '',
        metadata: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        let metadataParsed = formData.metadata && formData.metadata !== '' ? JSON.parse(formData.metadata) : {};
        const token = localStorage.getItem('token');

        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/logs`, {
                message: formData.message,
                level: formData.level,
                source: formData.source,
                metadata: metadataParsed
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setFormData({
                message: '',
                level: '',
                source: '',
                metadata: ''
            });

        } catch (err) {
            setError(err.message);
            return;
        } finally {
            setLoading(false);
        }
    }

    return (
        <div>
            <h1>Manual Upload</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Message </label>
                    <input
                        type='text'
                        name='message'
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Level </label>
                    <input
                        type='text'
                        name='level'
                        value={formData.level}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Source </label>
                    <input
                        type='text'
                        name='source'
                        value={formData.source}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Metadata </label>
                    <input
                        type='text'
                        name='metadata'
                        value={formData.metadata}
                        onChange={handleChange}
                    />
                </div>

                {error && <p>{error}</p>}
                {loading && <p>Loading...</p>}


                <button type='submit' disabled={loading}>
                    {loading ? "Submitting..." : "Submit"}
                </button>
            </form>
        </div>
    )
}
export default Upload