import { useState, useEffect } from 'react';
import axios from 'axios';

function LogsPage() {

    const [logs, setLogs] = useState([]);
    const [levelData, setLevelData] = useState([]);
    const [sourceData, setSourceData] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [levelRes, sourceRes, logsRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/logs/aggregate/level`),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/logs/aggregate/source`),
                    axios.get(`${process.env.REACT_APP_API_BASE_URL}/logs/logs`)
                ]);

                setLevelData(levelRes.data);
                setSourceData(sourceRes.data);
                setLogs(logsRes.data);
            } catch (err) {
                console.error('Error during fetchData:', err);
                setError(err.message);
            } finally {
                console.log('Done loading');
                setLoading(false);
            }
        };

        fetchData();
    }, []);


    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <h2>Level Aggregates</h2>
                    {levelData.length === 0 ? <p>No level data</p> : (
                        <ul>
                            {levelData.map((item, index) => (
                                <li key={index}>{item.level}: {item.count}</li>
                            ))}
                        </ul>
                    )}

                    <h2>Source Aggregates</h2>
                    {sourceData.length === 0 ? <p>No source data</p> : (
                        <ul>
                            {sourceData.map((item, index) => (
                                <li key={index}>{item.source}: {item.count}</li>
                            ))}
                        </ul>
                    )}

                    <h2>Logs</h2>
                    {logs.length === 0 ? <p>No Logs Found</p> : (
                        <ul>
                            {logs.map(log => (
                                <li key={log.id}>
                                    {log.ts} {log.level} - {log.source}: {log.message}
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}
        </div>
    );

}

export default LogsPage;